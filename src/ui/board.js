import { Connection } from "./connection.js";
import { Tile } from "./tile.js";

export class Board {
    constructor(rows, cols, container) {
        this._rows = rows;
        this._cols = cols;
        this._container = container;
        this._tiles = []; 
        this._connections = [];
    }

    setNumberGenerator(numberGenerator) {
        if (Array.isArray(numberGenerator)) {
            this._numberGenerator = () => {
                const index = Math.floor(Math.random() * numberGenerator.length);
                return numberGenerator[index];
            }
            return;
        }

        if (typeof numberGenerator === "function") {
            this._numberGenerator = numberGenerator;
            return;
        }

        throw new Error("Number generator must be an array or a function");
    }

    updateNumberGenerator() {
        const numbers = [];
        for (let i = 0; i < this._rows; i++) {
            for (let j = 0; j < this._cols; j++) {
                if (this._tiles[i][j] === null) continue;
                numbers.push(this._tiles[i][j].value);
            }
        }
        const toPickFrom = [...new Set(numbers).values()].sort((a, b) => a-b).slice(0, 4);
        console.log(toPickFrom);
        this.setNumberGenerator(toPickFrom);
    }


    setInputSequence(inputSequence) {
        this._inputSequence = inputSequence;
    }


    populateTiles() {
        if (!this._numberGenerator) throw new Error("Number generator not set");
        for (let i = 0; i < this._rows; i++) {
            const row = [];
            for (let j = 0; j < this._cols; j++) {
                const tile = new Tile(i, j, this._numberGenerator(), this._container, this);
                row.push(tile);
            }
            this._tiles.push(row);
        }
    }

    createNewTile(i, j) {
        if (this._tiles[i][j] !== null) throw new Error("Making tile at a place where tile already exists");
        const tile = new Tile(i, j, this._numberGenerator(), this._container, this);
        this._tiles[i][j] = tile;
    }

    async removeTiles(tilesToRemove) {
        const removeTilesInColumn = async (columnIndex, tiles) => {
            if (tiles.length == 0) return;
            const removeTilesPromises = [];
            for (let i = 0; i < tiles.length; i++) {
                this._tiles[tiles[i].row][columnIndex] = null;
                removeTilesPromises.push(tiles[i].remove());
            }
            await Promise.all(removeTilesPromises);
            let currentIndex = this._rows - 1;
            for (let i = this._rows - 1; i >= 0; i--) {
                if (this._tiles[i][columnIndex] !== null) {
                    this._tiles[currentIndex][columnIndex] = this._tiles[i][columnIndex];
                    this._tiles[currentIndex][columnIndex].row = currentIndex;
                    currentIndex--;
                }
            }
            const removedCount = currentIndex + 1;
            while (currentIndex >= 0) {
                this._tiles[currentIndex][columnIndex] = null;
                currentIndex--;
            }
            return removedCount;
        }
        const createTilesInColumn = async (columnIndex, tileCountPromise) => {
            const tileCount = await tileCountPromise;
            for (let i = 0; i < tileCount; i++) {
                this.createNewTile(i, columnIndex);
            }
        }

        for (const columnIndex in tilesToRemove) {
            const removedCount = removeTilesInColumn(columnIndex, tilesToRemove[columnIndex]);
            this.updateNumberGenerator();
            createTilesInColumn(columnIndex, removedCount);
        }
    }

    createConnection(sourceTile, destinationTile) {
        this._connections.push(new Connection(sourceTile, destinationTile, this._container));
    }

    removeConnectionsOf(tile) {
        this._connections = this._connections.filter(connection => {
            const toRemove = (connection.source === tile || connection.destination === tile);
            if (toRemove) {
                connection.remove();
            }
            return !toRemove
        });
    }

    getTilesFreqMapping() {
        const mapping = {};
        for (let i = 0; i < this._rows; i++) {
            for (let j = 0; j < this._cols; j++) {
                if (this._tiles[i][j] === null) {
                    continue;
                }
                if (!mapping[this._tiles[i][j].value]) {
                    mapping[this._tiles[i][j].value] = [];
                }
                mapping[this._tiles[i][j].value].push(this._tiles[i][j]);
            }
        }
        return mapping;
    }
}