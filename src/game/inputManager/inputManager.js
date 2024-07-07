import { isTouchDevice } from "../../utils/browser.js";
import { InputManagerMouse } from "./inputManagerMouse.js";
import { InputManagerTouch } from "./inputManagerTouch.js";

const touchDevice = isTouchDevice();

export class InputManager {
    static _instance = null;
    static get instance() {
        if (InputManager._instance === null) {
            if (touchDevice) {
                InputManager._instance = InputManagerTouch.instance;
            } else {
                InputManager._instance = InputManagerMouse.instance;
            }
        }
        return InputManager._instance;
    }
}