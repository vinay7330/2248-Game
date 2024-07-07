import { roundDownToPowerOfTwo, roundToClosestPowerOfTwo } from "../utils/math.js";

export class InputSequence {
    constructor() {
        this._tileSequence = [];
        this.subscribers = {};
    }

    isTileAdjacentTo(tile1, tile2) {
        return Math.abs(tile1.row - tile2.row) <= 1 && Math.abs(tile1.col - tile2.col) <= 1;
    }

    isTileAllowed(tile) {
        if (this._tileSequence.includes(tile)) return false;
        if (this._tileSequence.length === 0) return true;

        const allowedByValue = (
            (this._tileSequence.length >= 1 && this._tileSequence[this._tileSequence.length - 1]._value === tile._value) ||
            (this._tileSequence.length > 1 && this._tileSequence[this._tileSequence.length - 1]._value * 2 === tile._value)
        )
        return this.isTileAdjacentTo(tile, this._tileSequence[this._tileSequence.length - 1]) && allowedByValue;
    }

    isValid() {
        return this._tileSequence.length >= 2;
    }

    removeTiles(startIndex) {
        const removedTiles = this._tileSequence.splice(startIndex);
        this.publishEvent("tiles-removed", removedTiles);
        return removedTiles;
    }

    tryAddTile(tile) {
        const foundIndex = this._tileSequence.findIndex((t) => t === tile);
        if (foundIndex !== -1 && foundIndex === this._tileSequence.length - 2) {
            this.removeTiles(foundIndex+1);
            return;
        }

        if (this.isTileAllowed(tile)) {
            const lastTile = this._tileSequence.length <= 0 ? null : this._tileSequence[this._tileSequence.length - 1];
            this._tileSequence.push(tile);
            this.publishEvent("tile-added", { lastTile, tile });
        }
        return;
    }

    clear() {
        this.removeTiles(0);
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

    calculateFinalValueFromSequence() {
        let sum = 0;
        for (const tile of this._tileSequence) {
            sum += tile.value;
            sum = roundToClosestPowerOfTwo(sum);
        }
        return sum;
    }
}
