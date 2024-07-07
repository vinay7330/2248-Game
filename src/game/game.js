import { InputSequence } from "./inputSequence.js";
import { InputManager } from "./inputManager/inputManager.js";
import { Score } from "../ui/score.js";

export class Game {
    constructor(board) {
        this.board = board;
        InputManager.instance.init(board);
        InputManager.instance.subscribe("select", ([row, col]) => { this.handleSelect(row, col) })
        InputManager.instance.subscribe("end", this.handleSelectEnd.bind(this));
        
        this.currentInputSequence = new InputSequence();
        this.currentInputSequence.subscribe("tile-added", this.handleTileAdded.bind(this));
        this.currentInputSequence.subscribe("tiles-removed", this.handleTilesRemoved.bind(this));
    }

    handleSelect(row, col) {
        if (!this.board._tiles[row][col]) return;
        const added = this.currentInputSequence.tryAddTile(this.board._tiles[row][col]);
        if (added) {
            this.board._tiles[row][col].activate(true);
        }
    }

    async handleSelectEnd() {
        if (!this.currentInputSequence.isValid()) {
            this.currentInputSequence.clear();
            return;
        }

        const newValue = this.currentInputSequence.calculateFinalValueFromSequence();
        const [excludedTile] = this.currentInputSequence.removeTiles(this.currentInputSequence._tileSequence.length - 1);
        excludedTile.value = newValue;
        Score.addScore(newValue);

        let tilesToRemove = [];
        this.currentInputSequence._tileSequence.forEach(tile => {
            if (tilesToRemove[tile.col] == null) tilesToRemove[tile.col] = [];
            tilesToRemove[tile.col].push(tile);
        })
        this.board.removeTiles(tilesToRemove);

      
        tilesToRemove = [];
        const freqMapping = this.board.getTilesFreqMapping();
        const values = Object.keys(freqMapping).sort((a, b) => a-b);
        if (values.length >= 5) {
            const removeCandidates = freqMapping[values[0]];
            if (removeCandidates.length < 4) {
                for (const tile of freqMapping[values[0]]) {
                    if (tilesToRemove[tile.col] == null) tilesToRemove[tile.col] = [];
                    tilesToRemove[tile.col].push(tile);
                }
            }
            this.board.removeTiles(tilesToRemove);
        }

        this.currentInputSequence.clear();
    }

    handleTileAdded({ lastTile, tile }) {
        tile.activate(true);
        if (lastTile) {
            this.board.createConnection(lastTile, tile);
        }
    }

    handleTilesRemoved(tiles) {
        tiles.forEach(tile => {
            if (!tile) return;
            tile.activate(false);
            this.board.removeConnectionsOf(tile)
        });
    }
}
