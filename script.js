const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const box = 20;
let snake, direction, food, score, game, speed;

let highScore = localStorage.getItem("highScore") || 0;
document.getElementById("highScore").innerText = highScore;

// Start Game
function startGame() {
  document.getElementById("menu").style.display = "none";
  canvas.style.display = "block";
  init();
}

// Restart
function restartGame() {
  document.getElementById("gameOver").classList.add("hidden");
  init();
}

// Initialize
function init() {
  snake = [{ x: 200, y: 200 }];
  direction = "RIGHT";
  score = 0;
  speed = 200;

  food = randomFood();

  document.getElementById("score").innerText = score;

  clearInterval(game);
  game = setInterval(draw, speed);
}

// Controls
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  else if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
  else if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  else if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
});

// Draw
function draw() {
  ctx.fillStyle = "#1e293b";
  ctx.fillRect(0, 0, 400, 400);

  // Snake
  snake.forEach((part, i) => {
    ctx.fillStyle = i === 0 ? "#3b82f6" : "#93c5fd";
    ctx.fillRect(part.x, part.y, box, box);
  });

  // Food
  ctx.fillStyle = "#ef4444";
  ctx.fillRect(food.x, food.y, box, box);

  let headX = snake[0].x;
  let headY = snake[0].y;

  if (direction === "UP") headY -= box;
  if (direction === "DOWN") headY += box;
  if (direction === "LEFT") headX -= box;
  if (direction === "RIGHT") headX += box;

  // Eat
  if (headX === food.x && headY === food.y) {
    score++;
    document.getElementById("score").innerText = score;

    // Increase speed 🔥
    if (speed > 60) speed -= 5;
    clearInterval(game);
    game = setInterval(draw, speed);

    food = randomFood();
  } else {
    snake.pop();
  }

  let newHead = { x: headX, y: headY };

  // Game Over
  if (
    headX < 0 || headY < 0 ||
    headX >= 400 || headY >= 400 ||
    collision(newHead, snake)
  ) {
    endGame();
    return;
  }

  snake.unshift(newHead);
}

// Food generator
function randomFood() {
  return {
    x: Math.floor(Math.random() * 20) * box,
    y: Math.floor(Math.random() * 20) * box
  };
}

// Collision
function collision(head, body) {
  return body.some(part => part.x === head.x && part.y === head.y);
}

// End Game
function endGame() {
  clearInterval(game);

  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore);
  }

  document.getElementById("highScore").innerText = highScore;
  document.getElementById("gameOver").classList.remove("hidden");
}