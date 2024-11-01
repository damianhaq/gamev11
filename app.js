import {
  Character,
  drawLineOnMap,
  drawText,
  Game,
  Projectile,
  Sprite,
  Tiled,
  Vector,
} from "./DGamev3.js";
// import jsonData from "./gamev11map.json" with { type: "json" };

const game = new Game();
game.init("canvas", 1200, 1000, 3);
game.isDebug = false;

const bigSpritev7 = new Image();
bigSpritev7.src = "assets/BigSpritev7.png";

const flameImg = new Image();
flameImg.src = "assets/579.png";

const map = new Tiled(game, "./gamev11map.json", bigSpritev7);

const player = new Character(0, 0, 16, 22, game);
player.enableWSADMove();
// player.enableMOUSEMove("LMB");

player.addAnim("stand", 0, 10, 16, 22, 4, bigSpritev7);
player.addAnim("run", 64, 10, 16, 22, 4, bigSpritev7);
player.setCurrentAnim("stand");
player.isOriginInCenter = true;

console.log("player", player);

const projectiles = [];

game.update = function (deltaTime) {
  player.update(deltaTime);
  game.updateCamera(player.x, player.y);
  // game.moveCameraRMB();

  projectiles.forEach((el) => {
    el.update(deltaTime);
  });

  // console.log(game.mouse.cameraLastMousePosition);
};

game.draw = function (deltaTime) {
  game.clearRect();
  map.drawLayer("grass");
  player.draw(deltaTime);
  drawText(`player velocity x: ${player.vel.x}`, 10, 40, game);
  drawText(`player acceleration x: ${player.acc.x}`, 10, 50, game);
  drawText(`controlls type: ${player.controllsType}`, 10, 30, game);

  projectiles.forEach((el) => {
    el.draw(deltaTime);
  });
};

game.onClickLMB = function () {
  // create vector from player to mouse position

  const mouseVector = new Vector(
    Math.round(game.mouse.x + game.camera.x - player.x),
    Math.round(game.mouse.y + game.camera.y - player.y)
  );

  // normalize and multiply by 0.5
  mouseVector.normalize();
  // mouseVector.mul(0.1, 0.1);

  // get angle in degrees
  const angle = mouseVector.getAngleDeg();

  const flame = new Projectile(
    mouseVector.x + player.x,
    mouseVector.y + player.y,
    64,
    64,
    game,
    mouseVector.x,
    mouseVector.y
  );

  flame.addAnim("fly", 0, 0, 64, 64, 11, flameImg);

  flame.anim.fly.frameTime = 50;
  flame.anim.fly.rotateDeg = angle + 180;
  flame.isOriginInCenter = true;

  projectiles.push(flame);
  console.log(projectiles);
};

game.onMouseMove = function () {};
