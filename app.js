import {
  Character,
  drawText,
  Game,
  GUI,
  Projectile,
  Sprite,
  Tiled,
  Vector,
} from "./DGamev3.js";
// import jsonData from "./gamev11map.json" with { type: "json" };

const game = new Game();
game.init("canvas", 1200, 900, 3);
game.isDebug = false;

game.createGroup("projectiles");
game.createGroup("effects");
game.createGroup("player");

const bigSpritev7 = new Image();
bigSpritev7.src = "assets/BigSpritev7.png";

const flameImg = new Image();
flameImg.src = "assets/579.png";

const flameOnGroundImg = new Image();
flameOnGroundImg.src = "assets/70.png";

const gui = new GUI(game);
gui.addImage(bigSpritev7);
gui.addTile(352, 912, 16, 16, "mainWindow", "leftTop");
gui.addTile(368, 912, 16, 16, "mainWindow", "top");
gui.addTile(384, 912, 16, 16, "mainWindow", "rightTop");
gui.addTile(352, 928, 16, 16, "mainWindow", "left");
gui.addTile(368, 928, 16, 16, "mainWindow", "center");
gui.addTile(384, 928, 16, 16, "mainWindow", "right");
gui.addTile(352, 960, 16, 16, "mainWindow", "leftBottom");
gui.addTile(368, 960, 16, 16, "mainWindow", "bottom");
gui.addTile(384, 960, 16, 16, "mainWindow", "rightBottom");

const dataToDrawMainWindow = gui.createWindow(
  8,
  3,
  "mainWindow",
  0,
  300 - 16 * 3
);
const dataToDrawSecondWindow = gui.createWindow(3, 3, "mainWindow", 10, 100);

console.log("gui", gui);
console.log("dataToDrawMainWindow", dataToDrawMainWindow);

const map = new Tiled(game, "./gamev11map.json", bigSpritev7);

const player = new Character(0, 0, 16, 22, game);
player.enableWSADMove();
// player.enableMOUSEMove("LMB");

player.addAnim("stand", 0, 10, 16, 22, 4, bigSpritev7);
player.addAnim("run", 64, 10, 16, 22, 4, bigSpritev7);
player.setCurrentAnim("stand");
player.isOriginInCenter = true;

console.log("player", player);

game.addToGroup("player", player);

game.update = function (deltaTime) {
  game.updateCamera(player.x, player.y);
  // game.moveCameraRMB();
};

game.draw = function (deltaTime) {
  game.clearRect();
  const groundCounter = map.drawLayer("ground", player.x, player.y);
  const leafsCounter = map.drawLayer("leafs and flowers", player.x, player.y);
  const roads = map.drawLayer("roads", player.x, player.y);

  drawText(`player velocity x: ${player.vel.x}`, 10, 40, game);
  drawText(`player acceleration x: ${player.acc.x}`, 10, 50, game);
  drawText(`controlls type: ${player.controllsType}`, 10, 30, game);
  drawText(`player position x: ${player.x} y: ${player.y}`, 10, 20, game);
  drawText(`ground tiles: ${groundCounter}`, 10, 60, game);
  drawText(`leaf tiles: ${leafsCounter}`, 10, 70, game);
  drawText(`roads tiles: ${roads}`, 10, 80, game);
  drawText(
    `groups length: ${game.groups.map((g) => g.sprites.length)}`,
    10,
    90,
    game
  );

  gui.draw(dataToDrawMainWindow);
  gui.draw(dataToDrawSecondWindow);
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
  flame.killAfterDistance(1000);

  flame.anim.fly.frameTime = 50;
  flame.anim.fly.rotateDeg = angle + 180;
  flame.isOriginInCenter = true;

  const flameOnGround = new Sprite(player.x, player.y + 12, 64, 64, game);
  flameOnGround.addAnim("burn", 0, 0, 64, 64, 9, flameOnGroundImg);
  flameOnGround.anim.burn.frameTime = 50;
  flameOnGround.isOriginInCenter = true;
  flameOnGround.killAfterFirstAnim = true;

  game.addToGroup("projectiles", flame);
  game.addToGroup("effects", flameOnGround);
};

game.onMouseMove = function () {};
