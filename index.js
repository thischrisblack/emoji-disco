import { Dancer } from "./dancer.js";
import { createDancerElement } from "./create-dancer-element.js";

const danceFloor = document.getElementById("dancefloor");

// Set number of dancers.
const numberOfDancers = nearestPowerOf2(dancefloor.offsetWidth / 30);

let dancers = [];

populateDanceFloor(numberOfDancers);

console.log(dancers);

function populateDanceFloor(numberOfDancers) {
    for (let i = 0; i < numberOfDancers; i++) {
        const newDancer = createDancerElement(danceFloor, i, numberOfDancers);
        danceFloor.appendChild(newDancer);
        dancers.push(new Dancer(newDancer, i, numberOfDancers, danceFloor));
    }
}

window.AudioContext =
    window.AudioContext || window.webkitAudioContext || window.mozAudioContext;

const audioCtx = new (AudioContext || webkitAudioContext)();

const fileSelector = document.getElementById("audio-file");

fileSelector.addEventListener("change", (fileInput) => {
    // check for file
    if (fileInput.target.files[0] == undefined) {
        return false;
    }
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(fileInput.target.files[0]);
    fileReader.onload = (e) => analyzeAudio(e);
});

function nearestPowerOf2(number) {
    return Math.pow(2, Math.round(Math.log(number) / Math.log(2)));
}

function analyzeAudio(e) {
    // Decode audio
    audioCtx.decodeAudioData(e.target.result).then(function (buffer) {
        var soundSource = audioCtx.createBufferSource();
        soundSource.buffer = buffer;

        //Create analyser node
        const analyserNode = audioCtx.createAnalyser();
        analyserNode.fftSize = numberOfDancers * 2;
        analyserNode.minDecibels = -150;
        analyserNode.maxDecibels = 0;
        const bufferLength = analyserNode.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        //Set up audio node network
        soundSource.connect(analyserNode);
        analyserNode.connect(audioCtx.destination);
        soundSource.start(0);

        dance(analyserNode, dataArray);
    });
}

function dance(analyserNode, dataArray) {
    //Schedule next redraw
    requestAnimationFrame(() => dance(analyserNode, dataArray));

    //Get spectrum data
    analyserNode.getByteFrequencyData(dataArray);

    document.body.style.backgroundColor = `rgb(${dataArray[1] - 100}, 0, 0)`;

    for (let i = 0; i < dataArray.length; i++) {
        dancers[i].dance(dataArray[i]);
        // const dancer = document.getElementById(i);
        // dancer.style.bottom = dataArray[i] + "px";
    }
}
