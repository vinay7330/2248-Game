import { Tile } from "../../ui/tile.js";
import { isTouchEventWithElement } from "../../utils/browser.js";

function findElementWithTouchEvent(board, touchEvent) {
    for (let i = 0; i < board._rows; i++) {
        for (let j = 0; j < board._cols; j++) {
            try {
                if (isTouchEventWithElement(touchEvent, board._tiles[i][j]._element)) {
                    return [i, j];
                }
            } catch (e) {}
        }
    }
    return [-1, -1];
}

export class InputManagerTouch {
    static _instance = null;
    static get instance() {
        if (!InputManagerTouch._instance) {
            InputManagerTouch._instance = new InputManagerTouch();
        }
        return InputManagerTouch._instance;
    }

    constructor() {
        this.isPressed = false;
        this.subscribers = {};
        this.currentHovered = [null, null];
    }

    init(board) {
        this.board = board;

        this.board._container.style.setProperty('--tile-size', '60px');
        this.board._container.style.setProperty('--tile-real-size', '55px');

        for (let i = 0; i < this.board._rows; i++) {
            for (let j = 0; j < this.board._cols; j++) {
                this.applyEventsOnTile(this.board._tiles[i][j], i, j);
            }
        }
        document.body.addEventListener('touchend', (e) => { this.handleTouchEnd(e); });
        Tile.subscribe("newtile", (tile) => {
            this.applyEventsOnTile(tile);
        });
    }

    applyEventsOnTile(tile) {
        tile._element.addEventListener('touchstart', (e) => { this.handleTouchStart(e, tile) });
        tile._element.addEventListener('touchcancel', (e) => { this.handleTouchCancel(e, tile) });
        tile._element.addEventListener('touchleave', (e) => { this.handleTouchLeave(e, tile) });
        tile._element.addEventListener('touchmove', (e) => { this.handleTouchMove(e, tile) });
    }

    handleTouchStart(e, tile) {
        if (!this.isPressed) {
            this.isPressed = true;
        }
        if (this.currentHovered[0] !== null) {
            this.publishEvent("select", [tile.row, tile.col]);
        }
    }
    handleTouchEnd(e, tile) {
        this.isPressed = false;
        this.publishEvent("end", null);
    }
    handleTouchMove(e, tile) {
        const [i, j] = findElementWithTouchEvent(this.board, e);
        console.log(i, j);
        if (i === -1) {
            this.currentHovered[0] = null;
            this.currentHovered[1] = null;
            return;
        }
        this.currentHovered[0] = i;
        this.currentHovered[1] = j;
        this.publishEvent("select", [i, j]);
    }


    publishEvent(event, data) {
        if (!this.subscribers[event]) return;
        this.subscribers[event].forEach(subscriberCallback => subscriberCallback(data));
    }

    subscribe(event, callback) {
        let index;
        if (!this.subscribers[event]) {
            this.subscribers[event] = [];
        }
        index = this.subscribers[event].push(callback) - 1;

        console.warn("TODO: Fix Index bug");
        return {
            unsubscribe() {
                this.subscribers[event].splice(index, 1);
            }
        };
    }
}
