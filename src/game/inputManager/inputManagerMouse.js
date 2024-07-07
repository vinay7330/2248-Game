import { Tile } from "../../ui/tile.js";

export class InputManagerMouse {
    static _instance = null;
    static get instance() {
        if (!InputManagerMouse._instance) {
            InputManagerMouse._instance = new InputManagerMouse();
        }
        return InputManagerMouse._instance;
    }

    constructor() {
        this.isPressed = false;
        this.subscribers = {};
        this.currentHovered = [null, null]; 
    }

    init(board) {
        this.board = board;
        for (let i = 0; i < this.board._rows; i++) {
            for (let j = 0; j < this.board._cols; j++) {
                this.applyEventsOnTile(this.board._tiles[i][j], i, j);
            }
        }
        document.body.addEventListener('mouseup', (e) => { this.handleMouseUp(e); });
        Tile.subscribe("newtile", (tile) => {
            this.applyEventsOnTile(tile);
        });
    }

    applyEventsOnTile(tile) {
        tile._element.addEventListener('mousedown', (e) => { this.handleMouseDown(e, tile) });
        tile._element.addEventListener('mouseover', (e) => { this.handleMouseOver(e, tile) });
        tile._element.addEventListener('mouseout', (e) => { this.handleMouseOut(e, tile) });
    }

    handleMouseDown(e, tile) {
        if (!this.isPressed) {
            this.isPressed = true;
        }
        if (this.currentHovered[0] !== null) {
            this.publishEvent("select", [tile.row, tile.col]);
        }
    }
    
    handleMouseUp(e) {
        this.isPressed = false;
        this.publishEvent("end", null);
    }

    handleMouseOver(e, tile) {
        this.currentHovered = [tile.row, tile.col];
        if (this.isPressed) {
            this.publishEvent("select", [tile.row, tile.col]);
        }
    }

    handleMouseOut(e, tile) {
        this.currentHovered[0] = null;
        this.currentHovered[1] = null;
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
