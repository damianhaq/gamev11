import {
  Character,
  drawLineOnMap,
  Game,
  Sprite,
  Tiled,
  Vector,
} from "./DGamev3.js";
// import jsonData from "./gamev11map.json" with { type: "json" };

const game = new Game();
game.init("canvas", 1200, 1000, 3);

const bigSpritev7 = new Image();
bigSpritev7.src = "BigSpritev7.png";

const map = new Tiled(game, "./gamev11map.json", bigSpritev7);

const player = new Character(0, 0, 16, 22, game);
player.enableWSADMove();
// player.enableMOUSEMove();

player.addAnim("stand", 0, 10, 16, 22, 4, bigSpritev7);
player.addAnim("run", 64, 10, 16, 22, 4, bigSpritev7);
player.setCurrentAnim("stand");

console.log("player", player);

const particles = [];

game.update = function (deltaTime) {
  player.update(deltaTime);
  game.updateCamera(player.x, player.y);
  // game.moveCameraRMB();

  // particles.forEach((particle) => {
  //   particle.update(deltaTime);
  // });

  // console.log(game.mouse.cameraLastMousePosition);
};

game.draw = function (deltaTime) {
  game.clearRect();
  map.drawLayer("grass");
  player.draw(deltaTime);

  particles.forEach((particle) => {
    particle.draw(deltaTime);
  });
};

game.onClickLMB = function () {
  // create vector from player to mouse position

  const mouseVector = new Vector(
    Math.round(game.mouse.x + game.camera.x - player.x),
    Math.round(game.mouse.y + game.camera.y - player.y)
  );
  console.log("mouseVector", mouseVector);

  const particle = new Sprite(
    mouseVector.x + player.x,
    mouseVector.y + player.y,
    16,
    22,
    game
  );

  particle.addAnim("stand", 0, 10, 16, 22, 4, bigSpritev7);

  particles.push(particle);
};

game.onMouseMove = function () {
  console.log("testmouse move");
  // cerate vector from player to mouse position

  const mouseVector = new Vector(
    Math.round(game.mouse.x + game.camera.x - player.x),
    Math.round(game.mouse.y + game.camera.y - player.y)
  );

  // draw line from player to mouse position
  drawLineOnMap(
    player.x,
    player.y,
    mouseVector.x + player.x,
    mouseVector.y + player.y,
    game.ctx,
    game.camera
  );
};
