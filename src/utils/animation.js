export function forceAnimationRestart(element) {
    element.style.animation = "none";
    element.offsetHeight;
    element.style.animation = null; // So it inherits from stylesheet again
}
