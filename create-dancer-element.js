import { emojiArray } from "./emoji-array.js";

function randomEmoji() {
    return emojiArray[Math.floor(Math.random() * emojiArray.length)];
}

export function createDancerElement(danceFloor, index, numberOfDancers) {
    const newDancer = document.createElement("span");
    newDancer.id = index;
    newDancer.classList.add("dancer");
    newDancer.style.left =
        (danceFloor.offsetWidth / numberOfDancers) * index + "px";
    newDancer.innerText = randomEmoji();
    return newDancer;
}
