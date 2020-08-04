/**
 * Creates analyserNode, soundSource, and freqLevels
 * @param e The input event
 * @param numberOfDancers The number of dancer elements
 * @param volumeSensitivity The minimum volume level to pay attention to
 */
export function createAnalyserNode(e, numberOfDancers, volumeSensitivity) {
    return new Promise((resolve, reject) => {
        window.AudioContext =
            window.AudioContext ||
            window.webkitAudioContext ||
            window.mozAudioContext;

        const audioCtx = new (AudioContext || webkitAudioContext)();

        // Decode audio
        audioCtx.decodeAudioData(e.target.result).then((buffer) => {
            const soundSource = audioCtx.createBufferSource();
            soundSource.buffer = buffer;

            //Create analyser node
            const analyserNode = audioCtx.createAnalyser();
            analyserNode.fftSize = numberOfDancers * 2;
            analyserNode.minDecibels = volumeSensitivity;
            analyserNode.maxDecibels = 0;

            const bufferLength = analyserNode.frequencyBinCount;
            // This array will hold the decibel level for each frequency block
            const freqLevels = new Uint8Array(bufferLength);

            //Set up audio node network
            soundSource.connect(analyserNode);
            analyserNode.connect(audioCtx.destination);

            resolve({ analyserNode, freqLevels, soundSource });
        });
    });
}
