import { Dancer } from "./dancer.js";
import { OverheadLight } from "./overhead-light.js";
import { createDancerElement } from "./create-dancer-element.js";
import { createAnalyserNode } from "./create-analyser-node.js";
import { createOverheadLight } from "./create-overhead-light.js";

/**
 * TODO
 *
 * Clean up code
 *
 * Write the README
 *
 */

const danceFloor = document.getElementById("dancefloor");
const turntables = document.querySelectorAll(".turntable");
const bassCones = document.querySelectorAll(".bass-cone");
const trebleCones = document.querySelectorAll(".treble-cone");
const dj = document.getElementById("dj");

// Number of dancers must be a power of 2 for the AnalyserNode fftSize property
// The lower the divisor of danceFloor.offsetWidth, the higher the number of dancers
const numberOfDancers = Math.pow(
    2,
    Math.round(Math.log(danceFloor.offsetWidth / 30) / Math.log(2))
);

// Array to hold the Dancer class instances
const dancers = [];

// Array to hold OverheadLight class instances
const overheadLights = [];

// Quietest dB level to use
const volumeSensitivity = -120;

// Create the dancer elements
populateDanceFloor(numberOfDancers);

// Create the lights
turnOnTheLights(20);

/**
 * Creates dancer elements in the DOM and adds instatiated Dancers to the dancers array
 * @param numberOfDancers The number of dancers to create
 */
function populateDanceFloor(numberOfDancers) {
    for (let i = 0; i < numberOfDancers; i++) {
        // Get the DOM element
        const dancer = createDancerElement(danceFloor, i, numberOfDancers);
        // Append it
        danceFloor.appendChild(dancer);
        // Instantiate a Dance class and push it to the dancers array
        dancers.push(new Dancer(dancer, i, numberOfDancers, danceFloor));
    }
}

/**
 * Renders the overhead lights to the DOM
 * @param numberOfLights Number of lights desired
 */
function turnOnTheLights(numberOfLights) {
    for (let i = 0; i < numberOfLights; i++) {
        // Get the DOM element
        const light = createOverheadLight(i, numberOfLights);
        // Append it
        document.body.appendChild(light);
        // Instantiate a OverheadLights class and push it to the overheadLights array
        overheadLights.push(new OverheadLight(light));
    }
}

// Listen for audio file selection
const fileSelector = document.getElementById("file-input");
fileSelector.addEventListener("change", (fileInput) => {
    // check for file
    if (fileInput.target.files[0] == undefined) {
        return false;
    }
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(fileInput.target.files[0]);
    fileReader.onload = (e) => dropTheNeedle(e);
});

// Listen for stop button
const stopButton = document.getElementById("stop-button");
stopButton.addEventListener("click", () => location.reload());

/**
 * Starts the audio analaysis process on selected file, plays, the music, and starts the animation
 * @param e The fileSelector input changed event
 */
async function dropTheNeedle(e) {
    const { analyserNode, freqLevels, soundSource } = await createAnalyserNode(
        e,
        numberOfDancers,
        volumeSensitivity
    );

    // Toggle the inputs
    fileSelector.style.display = "none";
    stopButton.style.display = "block";

    // Play the music
    soundSource.start();

    // Start animations
    rockTheHouse(analyserNode, freqLevels);
}

/**
 * Animates elements using decibel values of the frequency range of the music
 * @param analyserNode The audioCtx analyser node
 * @param freqLevels The array of frequency ranges to analyse
 */
function rockTheHouse(analyserNode, freqLevels) {
    // Schedule next redraw
    requestAnimationFrame(() => rockTheHouse(analyserNode, freqLevels));

    // Update decibel value of each frequency in the freqLevels array
    analyserNode.getByteFrequencyData(freqLevels);

    // This bass frequency is used for mose things, so let's name it
    const theBass = freqLevels[1];
    // The value about 3/4ths of the way through the freqLevels array is a good treble
    const theTreble = freqLevels[Math.floor(freqLevels.length * 0.75)];

    // Flash the red/black background
    document.body.style.backgroundColor = `rgb(${theBass - 100}, 0, 0)`;

    // Move the DJ
    dj.style.bottom = `${260 + theBass * 0.15}px`;

    // Jiggle the turntables
    const turntableAngle = (theBass / 255) * 60 - 40;
    turntables[0].style.transform = `rotate(${turntableAngle}deg)`;
    turntables[1].style.transform = `rotate(${-turntableAngle}deg)`;

    // Pop the bass cones
    const bassPopSize = theBass / 255 + 0.4;
    bassCones.forEach(
        (bassCone) => (bassCone.style.transform = `scale(${bassPopSize})`)
    );

    // Pop the treble cones
    const treblePopSize = theTreble / 255 + 0.7;
    trebleCones.forEach(
        (trebleCone) => (trebleCone.style.transform = `scale(${treblePopSize})`)
    );

    // Work the overhead lights
    overheadLights.forEach((light) => {
        light.lightShow(theTreble);
    });

    // Animate the dancers
    for (let i = 0; i < freqLevels.length; i++) {
        dancers[i].dance(freqLevels[i]);
    }
}
