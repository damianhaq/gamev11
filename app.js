import { Character, Game, Tiled } from "./DGamev3.js";
// import jsonData from "./gamev11map.json" with { type: "json" };

const game = new Game();
game.init("canvas", 800, 600, 3);

const bigSpritev7 = new Image();
bigSpritev7.src = "BigSpritev7.png";

const map = new Tiled(game, "./gamev11map.json", bigSpritev7);

const player = new Character(0, 0, 16, 22, game);
// player.enableWSADMove();
player.enableMOUSEMove();

player.addAnim("stand", 0, 10, 16, 22, 4, bigSpritev7);
player.addAnim("run", 64, 10, 16, 22, 4, bigSpritev7);
player.setCurrentAnim("stand");

game.setCamera(player.x, player.y);
console.log("player", player);

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

function update(deltaTime) {
  player.update(deltaTime);
}

function draw(deltaTime) {
  game.clearRect();
  map.drawLayer("grass");
  player.draw(deltaTime);
}
