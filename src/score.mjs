import { context } from "./app.mjs";

export function drawScore(score = 0) {
  context.font = "16px Arial";
  context.fillStyle = "white";
  context.fillText(`SCORE: ${score}`, 8, 20);
}

export function drawLife(life) {
  context.font = "16px Arial";
  context.fillStyle = "white";
  context.fillText(`LIFE: ${life}`, 100, 20);
}
