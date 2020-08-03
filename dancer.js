export class Dancer {
    constructor(dancer, index, numberOfDancers, danceFloor) {
        this.dancer = dancer;
        this.horizontalMovement =
            (Math.floor(Math.random() * 12) - 6) *
            ((numberOfDancers - index / 2) / numberOfDancers);
        this.dancefloorEdges = { left: 0, right: danceFloor.offsetWidth };
    }

    dance(volume) {
        this.dancer.style.bottom = volume + "px";
        const currentPosition = parseFloat(this.dancer.style.left);
        if (
            currentPosition < this.dancefloorEdges.left ||
            currentPosition > this.dancefloorEdges.right
        ) {
            this.horizontalMovement = -this.horizontalMovement;
        }
        this.dancer.style.left =
            parseFloat(this.dancer.style.left) + this.horizontalMovement + "px";
    }
}
