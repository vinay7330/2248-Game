import { ROWS, COLS } from "./constants.js"
import { Board } from "./ui/board.js";
import { Game } from "./game/game.js";
import { Score } from "./ui/score.js";

async function main() {
    console.log("info", "Starting");
    const container = document.querySelector(".container")
    const board = new Board(ROWS, COLS, container);
    board.setNumberGenerator([2, 4, 8,16,32]);
    board.populateTiles();
    new Game(board);
}
main();
