import {
  BRICKS,
  BRICK_COL_COUNT,
  BRICK_HEIGHT,
  BRICK_ROW_COUNT,
  BRICK_WIDTH,
  createBricks,
  drawBricks,
} from "./brick.mjs";
import { drawLife, drawScore } from "./score.mjs";

let SCORE = 0;
let LIFE = 3;

const canvas = document.querySelector("#game-canvas");
export const context = canvas.getContext("2d");

let x_ordinate_ball = canvas.width / 2;
let y_ordinate_ball = canvas.height - 30;

const SPEED_OF_BALL = 3;
let dx = SPEED_OF_BALL;
let dy = -SPEED_OF_BALL;

const BALL_RADIUS = 20;

const PADDLE_WIDTH = 75;
const PADDLE_HEIGHT = 10;

let x_ordinate_paddle = (canvas.width - PADDLE_WIDTH) / 2;

const dx_paddle = 7;

let LEFT_PRESSED = false;
let RIGHT_PRESSED = false;

// let GAME_RUNNING = false;

// ---------------------------------------------------
// press h : left, l : right to move paddle
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

function keyDownHandler(e) {
  const l_key_pressed = e.key === "l";
  const h_key_pressed = e.key === "h";

  if (l_key_pressed) {
    RIGHT_PRESSED = true;
  } else if (h_key_pressed) {
    LEFT_PRESSED = true;
  }
}
function keyUpHandler(e) {
  const l_key_pressed = e.key === "l";
  const h_key_pressed = e.key === "h";
  if (l_key_pressed) {
    RIGHT_PRESSED = false;
  } else if (h_key_pressed) {
    LEFT_PRESSED = false;
  }
}

// ---------------------------------------------- BRICK COLLISION DETECTION

function collisionDetection() {
  for (let c = 0; c < BRICK_COL_COUNT; ++c) {
    for (let r = 0; r < BRICK_ROW_COUNT; ++r) {
      const current_brick = BRICKS[c][r];
      const is_brick_invisible = current_brick.status === 0;
      const is_ball_hit_brick =
        x_ordinate_ball > current_brick.x &&
        x_ordinate_ball < current_brick.x + BRICK_WIDTH &&
        y_ordinate_ball > current_brick.y &&
        y_ordinate_ball < current_brick.y + BRICK_HEIGHT;

      if (is_brick_invisible) {
        continue;
      }

      if (is_ball_hit_brick) {
        dy = -dy;
        current_brick.status = 0;
        drawBall("orange");
        SCORE += 1;

        const has_hit_all_bricks = SCORE === BRICKS.flat().length;

        if (has_hit_all_bricks) {
          LIFE -= 1;
          const no_life_left = LIFE === 0;
          if (no_life_left) {
            // todo: restart game
            gameOver("GAME OVER");
          } else {
            restartGame(`${LIFE} left`);
          }
        }
      }
    }
  }
}

// ----------------------------------------------------

const drawBall = (ball_color = "grey") => {
  context.beginPath();
  context.arc(
    x_ordinate_ball,
    y_ordinate_ball,
    BALL_RADIUS,
    0,
    2 * Math.PI,
    false
  );
  context.fillStyle = ball_color;
  context.fill();
  context.closePath();
};

const drawPaddle = () => {
  context.beginPath();
  context.rect(
    x_ordinate_paddle,
    canvas.height - PADDLE_HEIGHT,
    PADDLE_WIDTH,
    PADDLE_HEIGHT
  );
  context.fillStyle = "white";
  context.fill();
  context.closePath();
};

// MAIN: runs every refresh
const draw = () => {
  context.clearRect(0, 0, canvas.width, canvas.height);
  drawScore(SCORE);
  drawLife(LIFE);
  drawBall();
  drawPaddle();
  collisionDetection();
  drawBricks();

  const is_ball_hit_right_left_wall =
    x_ordinate_ball > canvas.width - BALL_RADIUS ||
    x_ordinate_ball < BALL_RADIUS;
  const is_ball_hit_top_wall = y_ordinate_ball < BALL_RADIUS;
  const is_ball_hit_bottom_wall = y_ordinate_ball > canvas.height - BALL_RADIUS;

  if (is_ball_hit_right_left_wall) {
    dx = -dx;
  }
  if (is_ball_hit_top_wall) {
    dy = -dy;
  } else if (is_ball_hit_bottom_wall) {
    if (
      x_ordinate_ball > x_ordinate_paddle - BALL_RADIUS &&
      x_ordinate_ball < x_ordinate_paddle + PADDLE_WIDTH + BALL_RADIUS
    ) {
      dy = -dy;
    } else {
      LIFE -= 1;
      const no_life_left = LIFE === 0;

      if (no_life_left) {
        gameOver("GAME OVER");
      } else {
        restartGame(`${LIFE} left`);
      }
    }
  }

  if (RIGHT_PRESSED) {
    x_ordinate_paddle = Math.min(
      x_ordinate_paddle + dx_paddle,
      canvas.width - PADDLE_WIDTH
    );
  } else if (LEFT_PRESSED) {
    x_ordinate_paddle = Math.max(x_ordinate_paddle - dx_paddle, 0);
  }

  x_ordinate_ball += dx;
  y_ordinate_ball += dy;
};

// ---------------------------------- GAME CONTROL

// 30 fps
let interval;

// start another board
function restartGame(alert_message) {
  alert(alert_message);
  clearInterval(interval);
  SCORE = 0;
  x_ordinate_ball = canvas.width / 2;
  y_ordinate_ball = canvas.height - 30;
  x_ordinate_paddle = (canvas.width - PADDLE_WIDTH) / 2;
  dx = SPEED_OF_BALL;
  dy = -SPEED_OF_BALL;
  LEFT_PRESSED = false;
  RIGHT_PRESSED = false;
  createBricks();
  interval = setInterval(draw, 1000 / 60);
}

function gameOver(alert_message) {
  alert(alert_message);
  clearInterval(interval);
  startGameAfterGameOver();
}

let GAME_PAUSED = true;
const play_pause_button = document.querySelector("#play-pause");

function startGameAfterGameOver() {
  clearInterval(interval);
  document.location.reload();
}

function startNewGame() {
  draw();
  interval = setInterval(draw, 1000 / 60);
}

draw();

play_pause_button.addEventListener("click", () => {
  if (GAME_PAUSED) {
    startNewGame();
    GAME_PAUSED = false;
    play_pause_button.textContent = "PAUSE";
  } else {
    GAME_PAUSED = true;
    clearInterval(interval);
    play_pause_button.textContent = "PLAY";
  }
});
