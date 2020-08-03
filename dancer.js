import { emojiArray } from "./emoji-array.js";

function randomEmoji() {
    return emojiArray[Math.floor(Math.random() * emojiArray.length)];
}

export class Dancer {
    constructor(dancer, index, numberOfDancers, danceFloor) {
        this.dancer = dancer;
        this.horizontalMovement =
            (Math.floor(Math.random() * 16) - 8) *
            ((numberOfDancers - index / 2) / numberOfDancers);
        this.maxBoundary = { left: 0, right: danceFloor.offsetWidth - 10 };
    }

    dance(volume) {
        this.dancer.style.bottom = volume + "px";
        const currentPosition = parseFloat(this.dancer.style.left);
        if (
            currentPosition < this.maxBoundary.left ||
            currentPosition > this.maxBoundary.right
        ) {
            this.horizontalMovement = -this.horizontalMovement;
        }
        this.dancer.style.left =
            parseFloat(this.dancer.style.left) + this.horizontalMovement + "px";
    }
}
