export function createOverheadLight(index, numberOfLights) {
    const lightSpacing = document.body.offsetWidth / numberOfLights;
    const colors = ["red", "green", "blue", "yellow"];
    const light = document.createElement("div");
    const color = colors[index % colors.length];
    light.classList.add("overhead-light", `light-${color}`);
    light.style.left = index * lightSpacing + "px";
    return light;
}
