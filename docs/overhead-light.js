export class OverheadLight {
    constructor(light) {
        this.light = light;
        // Number of degrees to rotate per frame
        this.rotation = Math.random() / 2;
        this.angle = 0;
    }

    lightShow(level) {
        this.light.style.opacity = level / 255 / 2;
        if (this.angle > 20 || this.angle < -20) {
            this.rotation = -this.rotation;
        }
        this.angle += this.rotation;
        this.light.style.transform = `rotate(${this.angle}deg)`;
    }
}
