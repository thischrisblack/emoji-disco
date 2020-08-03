import { emojiArray } from "./emoji-array.js";

/**
 * Selects random emoji from emoji array
 */
function getRandomEmoji() {
    return emojiArray[Math.floor(Math.random() * emojiArray.length)];
}

/**
 * Creates a DOM element for a dancer
 * @param danceFloor The dence floor DOM element
 * @param index The index of the current dancer
 * @param numberOfDancers The total number of dancers
 */
export function createDancerElement(danceFloor, index, numberOfDancers) {
    const newDancer = document.createElement("span");
    newDancer.id = index;
    newDancer.classList.add("dancer");
    newDancer.style.left =
        (danceFloor.offsetWidth / numberOfDancers) * index + "px";
    newDancer.innerText = getRandomEmoji();
    return newDancer;
}
