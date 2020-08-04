import { Dancer } from "./dancer.js";
import { OverheadLight } from "./overhead-light.js";
import { createDancerElement } from "./create-dancer-element.js";
import { createAnalyserNode } from "./create-analyser-node.js";
import { createOverheadLight } from "./create-overhead-light.js";

const danceFloor = document.getElementById("dancefloor");

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
const fileSelector = document.getElementById("audio-file");
fileSelector.addEventListener("change", (fileInput) => {
    // check for file
    if (fileInput.target.files[0] == undefined) {
        return false;
    }
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(fileInput.target.files[0]);
    fileReader.onload = (e) => dropTheNeedle(e);
});

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

    // Hide the input
    fileSelector.style.display = "none";

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

    // Decibel value of each frequency in the freqLevels updated
    analyserNode.getByteFrequencyData(freqLevels);

    // Flash the red/black background
    document.body.style.backgroundColor = `rgb(${freqLevels[1] - 100}, 0, 0)`;

    // Work the overhead lights
    overheadLights.forEach((light) => {
        light.lightShow(freqLevels[Math.floor(freqLevels.length * 0.7)]);
    });

    // Animate the dancers
    for (let i = 0; i < freqLevels.length; i++) {
        dancers[i].dance(freqLevels[i]);
    }
}
