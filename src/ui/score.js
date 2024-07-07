import { forceAnimationRestart } from "../utils/animation.js";
import { numberRepresentation } from "../utils/math.js";

// static class
export class Score {
    static element = document.getElementById("score");
    static currentScore = 0;
    static addScore(scoreChange) {
        Score.currentScore += scoreChange;

        const currentScoreString = numberRepresentation(Score.currentScore, 2);
        this.element.innerHTML = currentScoreString;
        forceAnimationRestart(this.element);
    }
}
