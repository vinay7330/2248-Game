import { TileColor } from "../game/color.js";
import { numberRepresentation } from "../utils/math.js";

export class Tile {
    constructor(row, col, value, container, board) {
        this._row = row;
        this._col = col;
        this._board = board;
        this._isActive = false;

        this._element = document.createElement("div");
        this._element.classList.add("tile");
        this._element.style.setProperty("--i", row);
        this._element.style.setProperty("--j", col);
        this.value = value;
        
        container.appendChild(this._element);
        
        this._events = {
            "positionchange": [
            ],
            "mousedown": [],
            "mouseup": [],
            "mouseover": [],
            "mouseout": [],
        }
        
        Tile.publishEvent("newtile", this);
    }
    
    getColor(value) {
        return TileColor.getColor(value);
    }

    get value() {
        return this._value;
    }
    set value(value) {
        this._value = value;
        this._element.addEventListener("animationend", (e) => {
            if (e.animationName === "spawn") {
                this._element.classList.remove("spawn");
            }
        }, { once:true });
        this._element.classList.add("spawn");
        this._element.style.setProperty("--bg-color", this.getColor(value));

        const valueString = numberRepresentation(value, 1);
        this._element.textContent = value ? valueString : `(${this._row}, ${this._col})`;
    }

    /**
     * 
     * @param {string} event Event name
     * @param {Function} callback Callback function
     * @param {boolean?} once Once
     * @param {any[]} args Args to be passed to the callback
     */
    on(event, callback_, once=false, ...args) {
        if (!this._events.hasOwnProperty(event)) {
            throw new Error(`Event ${event} is not supported`);
        }
        if (!args) args = [];
        this._events[event].push({
            callback: (e) => {
                callback_(e, ...args);
            },
            once,
            args,
            originalCallback: callback_,
            applied: false,
        });
        this._applyEvents(true);
    }

    off() {
        throw new Error("Not implemented off")
    }

    /**
     * 
     * @param {boolean} toApply Whether to add to remove
     */
    _applyEvents(toApply) {
        for (const event in this._events) {
            for (const i in this._events[event]) {
                const { callback, once, args, applied } = this._events[event][i];
                if (toApply) {
                    if (applied) continue;

                    switch (event) {
                        case "positionchange":
                            // Don't need to apply positionchange
                            this._events[event][i].applied = true;
                        break;
                        case "click":
                        case "mousedown":
                        case "mouseup":
                        case "mouseover":
                        case "mouseout":
                            this._element.addEventListener(event, callback, once);
                            this._events[event][i].applied = true;
                        break;
                        default:
                            throw new Error("Unreachable code");
                    }
                } else {
                    throw new Error("Not implemented");
                }
            }
        }
    }

    get row() {
        return this._row;
    }
    set row(r) {
        const dr = r - this._row;
        this._row = r;
        this._element.style.setProperty("--i", this._row);
        this._onPositionChanged(dr, 0);
    }

    get col() {
        return this._col;
    }
    set col(c) {
       const dc = c - this._col;
       this._col = c;
       this._element.style.setProperty("--j", this._col);
       this._onPositionChanged(0, dc);
    }

    /**
     * 
     * @param {number} dr Delta row
     * @param {number} dc Delta column
     */
    _onPositionChanged(dr, dc) {
        for (const key in this._events["positionchange"]) {
            const { callback, once, args, applied } = this._events["positionchange"][key];
            callback({ target: this, row: this._row, col: this._col, drow: dr, dcol: dc });
        }
    }

    activate(toActive) {
        this._isActive = toActive;
        if (toActive) {
            this._element.classList.add("active");
        } else {
            this._element.classList.remove("active");
        }
    }

    remove() {
        return new Promise((res, rej) => {
            if (!this._element.isConnected) {
                rej("Tried to remove a tile which was already removed");
            }
            this._element.addEventListener("animationend", (e) => {
                this._element.remove();
                res(this._row, this._col);
            }, { once: true });
            this._element.classList.add("kill");
        })
    }

    static subscribers = {};
    static publishEvent(event, data) {
        if (!Tile.subscribers[event]) return;
        Tile.subscribers[event].forEach(subscriberCallback => subscriberCallback(data));
    }

    static subscribe(event, callback) {
        let index;
        if (!Tile.subscribers[event]) {
            Tile.subscribers[event] = [];
        }
        index = Tile.subscribers[event].push(callback) - 1;

        console.warn("TODO: Fix Index bug");
        return {
            unsubscribe() {
                Tile.subscribers[event].splice(index, 1);
            }
        };
    }
}