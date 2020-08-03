import { Dancer } from "./dancer.js";
import { createDancerElement } from "./create-dancer-element.js";
import { createAnalyserNode } from "./create-analyser-node.js";

const danceFloor = document.getElementById("dancefloor");

// Number of dancers must be a power of 2 for the AnalyserNode fftSize property
// The lower the divisor of danceFloor.offsetWidth, the higher the number of dancers
const numberOfDancers = Math.pow(
    2,
    Math.round(Math.log(danceFloor.offsetWidth / 30) / Math.log(2))
);

// Array to hold the Dancer class instances
const dancers = [];

// Quietest dB level to use
const volumeSensitivity = -120;

// Create the dancer elements
populateDanceFloor(numberOfDancers);

/**
 * Creates dancer elements in the DOM and adds instatiated Dancers to the dancers array
 * @param numberOfDancers The number of dancers to create
 */
function populateDanceFloor(numberOfDancers) {
    for (let i = 0; i < numberOfDancers; i++) {
        // Get the DOM element
        const newDancer = createDancerElement(danceFloor, i, numberOfDancers);
        // Append it
        danceFloor.appendChild(newDancer);
        // Instatiate a Dance class and push it to the dancers array
        dancers.push(new Dancer(newDancer, i, numberOfDancers, danceFloor));
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
    const { analyserNode, dataArray, soundSource } = await createAnalyserNode(
        e,
        numberOfDancers,
        volumeSensitivity
    );
    // Play the music
    soundSource.start();
    // Start animations
    rockTheHouse(analyserNode, dataArray);
}

/**
 * Animates elements using decibel values of the frequency range of the music
 * @param analyserNode The audioCtx analyser node
 * @param dataArray The array of frequency ranges to analyse
 */
function rockTheHouse(analyserNode, dataArray) {
    // Schedule next redraw
    requestAnimationFrame(() => rockTheHouse(analyserNode, dataArray));

    // Decibel value of each frequency in the dataArray updated
    analyserNode.getByteFrequencyData(dataArray);

    // Flash the red/black background
    document.body.style.backgroundColor = `rgb(${dataArray[1] - 100}, 0, 0)`;

    // Animate the dancers
    for (let i = 0; i < dataArray.length; i++) {
        dancers[i].dance(dataArray[i]);
    }
}
