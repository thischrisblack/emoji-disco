export class Dancer {
    constructor(dancer, index, numberOfDancers, danceFloor) {
        this.dancer = dancer;
        this.danceFloorEdges = { left: 0, right: danceFloor.offsetWidth };

        // Maximum number of pixels this dancer will move left or right per frame
        const maxSpeed = 6;
        // The closer this dancer is to the bass range, the greater its potential maximum movement
        const bassDifferential =
            (numberOfDancers - index / 2) / numberOfDancers;
        // Final movement rate is a random number between positive and negative maxSpeed * bassDifferential
        this.horizontalMovement =
            (Math.floor(Math.random() * maxSpeed * 2) - maxSpeed) *
            bassDifferential;
    }

    dance(volume) {
        // The bounce
        this.dancer.style.bottom = volume + "px";

        // The left/right movement
        const currentPosition = parseFloat(this.dancer.style.left);
        if (
            currentPosition < this.danceFloorEdges.left ||
            currentPosition > this.danceFloorEdges.right
        ) {
            // If at the edge of the dance floor, reverse direction
            this.horizontalMovement = -this.horizontalMovement;
        }

        // Update position
        this.dancer.style.left =
            parseFloat(this.dancer.style.left) + this.horizontalMovement + "px";
    }
}
