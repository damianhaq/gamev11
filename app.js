import { Game } from "./DGamev3.js";

const game = new Game();
game.init("canvas", 800, 600, 2);

// Game loop
requestAnimationFrame(gameLoop);
let lastTime = 0;
function gameLoop(timestamp) {
  const deltaTime = +(timestamp - lastTime).toFixed(2);
  lastTime = timestamp;

  update(deltaTime);

  draw(deltaTime);

  requestAnimationFrame(gameLoop);
}

function update(deltaTime) {}

function draw(deltaTime) {}
