import { Tile } from "./tile.js";

let container = null;
/**
 * 
 * @param {HTMLElement} parent Game container
 * @returns Container
 */
function createContainer(parent) {
    const container = document.createElement("div");
    container.classList.add("connections");
    parent.appendChild(container);
    return container;
}

export class Connection {
    /**
     * 
     * @param {Tile} source Source tile
     * @param {Tile} destination Destination tile
     * @param {HTMLElement} parent Game container
     */
    constructor(source, destination, parent) {
        if (!container) {
            container = createContainer(parent);
        }
        this.source = source;
        this.destination = destination;

        this.sr = null;
        this.sr = null;
        this.dr = null;
        this.dc = null;

        this._element = document.createElement("div");
        this._element.classList.add("connection");
        container.appendChild(this._element)
        this._updatePositions(this.source.row, this.source.col, this.destination.row, this.destination.col);

        const handlePositionChange = (e) => {
            if (e.target === this.source) {
                this._updatePositions(e.row, e.col, null, null);
            } else if (e.target === this.destination) {
                this._updatePositions(null, null, e.row, e.col);
            }
        }

        this.source.on("positionchange", handlePositionChange);
        this.destination.on("positionchange", handlePositionChange);
    }
    
    /**
     * 
     * @param {number} sr Source
     * @param {number} sc Source
     * @param {number} dr Destination
     * @param {number} dc Destination
     */
    _updatePositions(sr, sc, dr, dc) {
        // source x, source y, destination x, destination y
        if (sr !== null) {
            this.sr = sr;
        }
        if (sc !== null) {
            this.sc = sc;
        }
        if (dr !== null) {
            this.dr = dr;
        }
        if (dc !== null) {
            this.dc = dc;
        }
        if (this.dc < this.sc) {
            const temp = this.source;
            this.source = this.destination;
            this.destination = temp;
            [this.sr, this.sc, this.dr, this.dc] = [this.dr, this.dc, this.sr, this.sc];
        }
        this._element.style.setProperty("--sx", this.sc);
        this._element.style.setProperty("--sy", this.sr);
        this._element.style.setProperty("--dx", this.dc);
        this._element.style.setProperty("--dy", this.dr);
    }

    // TODO: connection remove animation
    // Take hint from tile remove animation
    remove() {
        this._element.remove();
    }
}
