import { context } from "./app.mjs";

export const BRICK_ROW_COUNT = 3;
export const BRICK_COL_COUNT = 5;
export const BRICK_WIDTH = 75;
export const BRICK_HEIGHT = 20;
const BRICK_PADDING = 10;
const BRICK_OFFSET_TOP = 30;
const BRICK_OFFSET_LEFT = 30;

export let BRICKS = [];

export function createBricks() {
  for (let c = 0; c < BRICK_COL_COUNT; ++c) {
    BRICKS.push([]);
    for (let r = 0; r < BRICK_ROW_COUNT; ++r) {
      BRICKS[c][r] = { id: `${c}_${r}`, x: 0, y: 0, status: 1 };
    }
  }
}

createBricks();

export function drawBricks() {
  for (let c = 0; c < BRICK_COL_COUNT; ++c) {
    for (let r = 0; r < BRICK_ROW_COUNT; ++r) {
      const current_brick = BRICKS[c][r];

      const is_brick_invisible = current_brick.status === 0;

      if (is_brick_invisible) {
        continue;
      }

      const x_ordinate_brick =
        c * (BRICK_WIDTH + BRICK_PADDING) + BRICK_OFFSET_LEFT;
      const y_ordinate_brick =
        r * (BRICK_HEIGHT + BRICK_PADDING) + BRICK_OFFSET_TOP;

      current_brick.x = x_ordinate_brick;
      current_brick.y = y_ordinate_brick;

      context.beginPath();
      context.rect(
        x_ordinate_brick,
        y_ordinate_brick,
        BRICK_WIDTH,
        BRICK_HEIGHT
      );
      context.fillStyle = "red";
      context.fill();
      context.closePath();
    }
  }
}
