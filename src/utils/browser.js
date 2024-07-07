export function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints;
}
export function isTouchEventWithElement(e, element) {
    const item = e.changedTouches.item(0);
    if (element === null || item === null) return false;
    return element.getBoundingClientRect().right > item.clientX &&
        element.getBoundingClientRect().left < item.clientX &&
        element.getBoundingClientRect().top < item.clientY &&
        element.getBoundingClientRect().bottom > item.clientY;
}