// version 3.2
// - in Sprite, Animation can delete itself after animation is done
// - draw and update every sprite, that is added to some group, is done automatically in gameLoop in game class

// CLASSESS

export class Game {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.scaleFactor = 1;
    this.disableContextMenu = true;
    this.isDebug = true;
    this.lastTime = 0;
    this.fpsCounter = 0;

    this.groups = [];

    this.mouse = {
      clickFlag: false,
      isMouseDown: false,
      RMB: false,
      RMBClickFlag: false,
      Wheel: false,
      WheelClickFlag: false,
      cameraLastMousePosition: { x: 0, y: 0 },
      mouseMoveLastPosition: { x: 0, y: 0 },
      x: false,
      y: false,
    };

    this.keys = {
      key: [],
    };

    this.camera = {
      x: 0,
      y: 0,
    };
  }

  createGroup(name) {
    this.groups.push({ name, sprites: [] });
    console.log(`Group ${name} created. Groups:`, this.groups);
  }

  addToGroup(groupName, sprite) {
    // check if group exists
    const group = this.groups.find((group) => group.name === groupName);
    const index = this.groups.indexOf(group);

    if (!group) {
      console.error(`Group ${groupName} does not exist`);
      return;
    }

    if (!(sprite instanceof Sprite)) {
      console.error(
        `Error while adding to group ${groupName}. Parameter must be an instance of Sprite class`
      );
      return;
    }

    this.groups[index].sprites.push(sprite);

    console.log(
      `Sprite ${sprite.constructor.name} added to group ${groupName}. Groups:`,
      this.groups
    );
  }

  updateCamera(x, y) {
    this.camera.x = +(x - this.canvas.width / (2 * this.scaleFactor)).toFixed(
      1
    );
    this.camera.y = +(y - this.canvas.height / (2 * this.scaleFactor)).toFixed(
      1
    );

    // console.log("camera", this.camera.x, this.camera.y);
  }

  // this function have to be called on every frame
  moveCameraRMB() {
    if (this.mouse.RMB) {
      const dx = this.mouse.x - this.mouse.cameraLastMousePosition.x;
      const dy = this.mouse.y - this.mouse.cameraLastMousePosition.y;

      this.camera.x += dx * -1;
      this.camera.y += dy * -1;

      this.mouse.cameraLastMousePosition.x = this.mouse.x;
      this.mouse.cameraLastMousePosition.y = this.mouse.y;

      // console.log("camera", this.camera.x, this.camera.y);
    } else {
      this.mouse.cameraLastMousePosition.x = this.mouse.x;
      this.mouse.cameraLastMousePosition.y = this.mouse.y;
    }
  }

  /**
   * Initializes the game with the given canvas ID, dimensions, and scale factor.
   *
   * @param {string} canvasID - The ID of the canvas element to use.
   * @param {number} canvasWidth - The width of the game canvas.
   * @param {number} canvasHeight - The height of the game canvas.
   * @param {number} scaleFactor - The scale factor to apply to the canvas.
   */
  init(canvasID, canvasWidth, canvasHeight, scaleFactor) {
    this.canvas = document.querySelector(`#${canvasID}`);
    this.ctx = this.canvas.getContext("2d");
    this.scaleFactor = scaleFactor;

    this.canvas.width = canvasWidth;
    this.canvas.height = canvasHeight;
    this.canvas.style.border = "1px solid black";
    this.canvas.setAttribute("tabindex", 0);

    this.canvas.addEventListener("mousedown", (ev) => {
      // console.log(ev.which);
      if (ev.which === 3) {
        this.mouse.RMB = true;
      } else if (ev.which === 1) {
        this.mouse.isMouseDown = true;
      } else if (ev.which === 2) {
        this.mouse.Wheel = true;
      }
      this.mouse.x = Math.round(ev.offsetX / this.scaleFactor);
      this.mouse.y = Math.round(ev.offsetY / this.scaleFactor);
    });
    this.canvas.addEventListener("mouseup", (ev) => {
      if (ev.which === 3) {
        this.mouse.RMB = false;
      } else if (ev.which === 1) {
        this.mouse.isMouseDown = false;
      } else if (ev.which === 2) {
        this.mouse.Wheel = false;
      }
    });
    this.canvas.addEventListener("mousemove", (ev) => {
      this.mouse.x = Math.round(ev.offsetX / this.scaleFactor);
      this.mouse.y = Math.round(ev.offsetY / this.scaleFactor);
    });

    this.canvas.addEventListener("keydown", (ev) => {
      if (!this.keys.key[ev.keyCode]) this.keys.key[ev.keyCode] = true;
      // console.log(ev.keyCode);
    });
    this.canvas.addEventListener("keyup", (ev) => {
      if (this.keys.key[ev.keyCode]) this.keys.key[ev.keyCode] = false;
    });
    this.canvas.addEventListener("contextmenu", (ev) => {
      if (this.disableContextMenu) ev.preventDefault();
    });

    this.ctx.scale(this.scaleFactor, this.scaleFactor);
    this.ctx.imageSmoothingEnabled = false;

    this.updateCamera(0, 0);

    //  bind the method to your class to make sure this points to your class.
    requestAnimationFrame(this.gameLoop.bind(this));
  }

  clearRect() {
    this.ctx.fillStyle = "#898989";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  // Game loop
  gameLoop(timestamp) {
    const deltaTime = +(timestamp - this.lastTime).toFixed(2);
    this.lastTime = timestamp;
    const fps = 1000 / deltaTime;

    this.update(deltaTime);
    this.draw(deltaTime);

    // --------- draw -----------
    this.groups.forEach((group) => {
      group.sprites.forEach((sprite) => {
        sprite.draw(deltaTime);
      });
    });

    // --------- update -----------

    this.groups.forEach((group) => {
      group.sprites.forEach((sprite) => {
        // if update function exists
        if (sprite.update) sprite.update(deltaTime);
      });
    });

    const skipFactor = 100;
    if (Math.floor(timestamp / 10) % skipFactor === 0) {
      // kod który bedzie sie wykonywal co skipFactor petli
      this.fpsCounter = Math.round(fps);
    }
    drawText(`FPS: ${this.fpsCounter}`, 10, 10, this);

    // execute once if mouse is pressed
    if (this.mouse.isMouseDown && !this.mouse.clickFlag) {
      this.mouse.clickFlag = true;

      // execute once if mouse is pressed
      this.onClickLMB();
    } else if (!this.mouse.isMouseDown && this.mouse.clickFlag) {
      this.mouse.clickFlag = false;

      // execute once if mouse is unpressed
      this.onUnclickLMB();
    }

    // execute every mouse move
    if (
      this.mouse.x !== this.mouse.mouseMoveLastPosition.x ||
      this.mouse.y !== this.mouse.mouseMoveLastPosition.y
    ) {
      this.onMouseMove();
      this.mouse.mouseMoveLastPosition.x = this.mouse.x;
      this.mouse.mouseMoveLastPosition.y = this.mouse.y;
    }

    //  bind the method to your class to make sure this points to your class.
    requestAnimationFrame(this.gameLoop.bind(this));
  }

  update(deltaTime) {}
  draw(deltaTime) {}

  onClickLMB() {}
  onUnclickLMB() {}
  onMouseMove() {}
}

export class Sprite {
  constructor(x, y, width, height, game) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.game = game;

    this.isFlipX = false;
    this.isFlipY = false;

    this.isOriginInCenter = false;

    this.animName = "unset";
    this.killAfterFirstAnim = false;

    this.viewType = "unset"; // unset, texture, anim
  }

  // return array of tiles that current sprite overlaps with
  /**
   * Return array of tiles that current sprite overlaps with
   * @param {Array} tiles Array of tiles to check
   * @param {number} [x=this.x] X position of sprite to check
   * @param {number} [y=this.y] Y position of sprite to check
   * @returns {Array} Array of overlapping tiles
   */
  getOverlappingTiles(tiles, x = this.x, y = this.y) {
    const overlappingTiles = [];
    for (let i = 0; i < tiles.length; i++) {
      if (
        x < tiles[i].x + tiles[i].width &&
        x + this.width > tiles[i].x &&
        y < tiles[i].y + tiles[i].height &&
        this.height + y > tiles[i].y
      ) {
        overlappingTiles.push(tiles[i]);
      }
    }
    return overlappingTiles;
  }

  checkCollisionAABBNew(
    selfX,
    selfY,
    selfW,
    selfH,
    rx,
    ry,
    rw,
    rh,
    isDraw = false,
    tolerance = 0
  ) {
    // Ustalenie długości odcinków centerToCenterX oraz centerToCenterY.
    // Określają one poziomą i pionową odległość pomiędzy środkami obiektów.
    const centerToCenterX = rx + rw / 2 - (selfX + selfW / 2);
    const centerToCenterY = ry + rh / 2 - (selfY + selfH / 2);

    // Teraz obliczamy sume długości połowy wysokości obiektów i połowy szerokości obiektów.
    // Czyli połowa szerokości prostokta i połowa szerokości drugiego prostokta,
    // oraz połowa wysokości prostokta i połowa wysokości drugiego prostokta.
    const combinedHalfWidths = selfW / 2 + rw / 2;
    const combinedHalfHeights = selfH / 2 + rh / 2;

    // Porównuje odległość od środka pierwszego prostokąta do środka drugiego,
    // z połową szerokości/wysokości prostokąta pierwszego i drugiego (dodaje je).
    // Jeśli dwie połowy szerokości połączone ze sobą są mniejsze od odległości od jednego środka do drugiego,
    // to prostokąty nachodzą na siebie w osi X lub w osi Y.

    // Sprawdzam czy prostokąty nachodzą na siebie w osi X.
    const isxOverlap = Math.abs(centerToCenterX) < combinedHalfWidths;

    // Sprawdzam czy prostokąty nachodą na siebie w osi Y.
    const isyOverlap = Math.abs(centerToCenterY) < combinedHalfHeights;

    // jeśli nachodą na siebie w osi X i w osi Y, to prostokąty nachodzą na siebie.

    // Potrzebuje obliczyć o ile nachodzą na siebie obiekty na osi X i o ile na osi Y.
    // Od długości połączonych połówek, odejmuje odległość środek-środek,
    // co da mi wartość o ile pokrywają sie prostokąty.
    // Robie to w osi X i w osi Y.

    const overlapX = combinedHalfWidths - Math.abs(centerToCenterX);
    const overlapY = combinedHalfHeights - Math.abs(centerToCenterY);

    // Kolejny krok, to sprawdzenie czy mniejsze jest overlapX czy overlapY.
    // To, które jest mniejsze, wskazuje oś, na której obiekty się naszły.

    // jeśli overlapX jest mniejsze od overlapY,
    // to mniej nakładają sie na siebie w osi X, czyli jedno jest nad lub pod drugim.
    // Jeśli odwrotnie, to po jednej stronie lub po drugiej.

    const isLeftOrRight = overlapX < overlapY;
    const isTopOrBottom = !isLeftOrRight; // lub overlapX >= overlapY

    // Jeżeli overlapX jest wieksze od overlapY(góra-dół) a centerToCenterY jest dodatnie oznacza,
    // że obiekt pierwszy naszedł na drugi od dołu
    // (bo środek jednego jest niżej od środka drugiego(centerToCenterY dodatnie)).

    const isTop = isTopOrBottom && centerToCenterY < 0;
    const isBottom = isTopOrBottom && centerToCenterY > 0;
    const isLeft = isLeftOrRight && centerToCenterX < 0;
    const isRight = isLeftOrRight && centerToCenterX > 0;

    // jesli tolerancja jest większ od zera to róznica między overlapX i overlapY musi być wieksza od tolerancji aby uznać to za kolizje.
    // Czyli.. jeśli kolizja jest narożnik do narożnika, to nie uznawaj kolizji jeśli jedna strona(overlapX) będzie nachodzić na drugą(overlapY) słabiej n iż tolerancja, czyli np 1px.
    // Czyli.. uznaj kolizje tylko wtedy jeśli jedna strona nachodzi bardziej od drugiej o tolerancje.
    // Czyli w ptzypadku gdy mamy tolerancje 1px i jeśli od prawej strony nachodzi o 0.7 a od dołu o 0.7 to nie uznaj kolizji, lub prawej 0.7 a od dołu 1.1 to nie uznaj kolizji, ale jeśli od prawej 0.7 a od dołu 2.1 to uznaj kolizje, bo różnica jest wieksza od tolerancji.
    if (tolerance > 0 && Math.abs(overlapX - overlapY) < tolerance)
      return false;

    const isCollision = isxOverlap && isyOverlap;
    const side = `${isTop ? "top" : ""}${isBottom ? "bottom" : ""}${
      isLeft ? "left" : ""
    }${isRight ? "right" : ""}`;

    if (isDraw) {
      // Narysuj te linie
      const rectPoint1 = { x: rx + rw / 2, y: ry + rh / 2 };
      const rectPoint2 = {
        x: rx + rw / 2,
        y: selfY + selfH / 2,
      };
      const myPoint1 = {
        x: selfX + selfW / 2,
        y: selfY + selfH / 2,
      };
      const myPoint2 = { x: rx + rw / 2, y: selfY + selfH / 2 };

      // narysuj linie jeśli jest kolizja
      if (isCollision) {
        drawLineOnMap(
          myPoint1.x,
          myPoint1.y,
          myPoint2.x,
          myPoint2.y,
          this.game.ctx,
          this.game.camera,
          "red",
          2
        );
        drawLineOnMap(
          rectPoint1.x,
          rectPoint1.y,
          rectPoint2.x,
          rectPoint2.y,
          this.game.ctx,
          this.game.camera,
          "red",
          2
        );
      }
    }
    return isCollision
      ? { side, centerToCenterX, centerToCenterY, overlapX, overlapY }
      : false;
  }

  // /**
  //  * Check on which side of the tile current sprite is located
  //  * @param {Object} tile Tile to check
  //  * @returns {String} Side of the tile where the sprite is located (top, right, bottom, left)
  //  */
  // getSideOfTile(tile) {
  //   const isAbove = this.y + this.height / 2 >= tile.y + tile.height / 2;
  //   const isBelow = this.y + this.height / 2 <= tile.y + tile.height / 2;
  //   const isLeft = this.x + this.width / 2 >= tile.x + tile.width / 2;
  //   const isRight = this.x + this.width / 2 <= tile.x + tile.width / 2;

  //   if (isLeft) {
  //     return "left";
  //   }
  //   if (isRight) {
  //     return "right";
  //   }
  //   if (isAbove) {
  //     return "top";
  //   }
  //   if (isBelow) {
  //     return "bottom";
  //   }

  //   return null;
  // }

  addTexture(fromX, fromY, fromWidth, fromHeight, image) {
    this.viewType = "texture";
    this.texture = {
      fromX,
      fromY,
      fromWidth,
      fromHeight,
      image,
      rotateDeg: 0,
      rotatePointX: 0,
      rotatePointY: 0,
    };

    if (fromWidth !== this.width || fromHeight !== this.height) {
      console.log(
        "Wymiary tekstury: " +
          `${fromWidth}x${fromHeight}. ` +
          "Wymiary sprita: " +
          `${this.width}x${this.height}. ` +
          "Zalecane jest zmianę wymiarów sprita na wymiary tekstury."
      );
    }
  }

  setCurrentAnim(name) {
    if (this.viewType === "anim") {
      this.anim.currFrame = 0;
      this.anim.currFrameTime = 0;
      this.animName = name;
    }
  }

  addAnim(name, fromX, fromY, fromWidth, fromHeight, frames, image) {
    this.viewType = "anim";
    if (!this.anim) {
      this.anim = {};
    }

    this.anim[name] = {
      fromX,
      fromY,
      fromWidth,
      frames,
      fromHeight,
      image,
      currFrame: 0,
      frameTime: 100,
      currFrameTime: 0,
      rotateDeg: 0,
      rotatePointX: 0,
      rotatePointY: 0,
    };
    this.setCurrentAnim(name);

    if (fromWidth !== this.width || fromHeight !== this.height) {
      console.warn(
        "Wymiary tekstury animacji: " +
          `${fromWidth}x${fromHeight}. ` +
          "Wymiary sprita: " +
          `${this.width}x${this.height}. ` +
          "Zalecane jest zmianę wymiarów sprita na wymiary tekstury animacji."
      );
    }
  }

  draw(deltaTime) {
    if (this.viewType === "texture") {
      drawImagePartWithTransform(
        this.texture.image,
        this.texture.fromX,
        this.texture.fromY,
        this.texture.fromWidth,
        this.texture.fromHeight,
        this.x - this.game.camera.x,
        this.y - this.game.camera.y,
        this.texture.fromWidth,
        this.texture.fromHeight,
        this.isFlipX,
        this.isFlipY,
        this.texture.rotateDeg,
        this.texture.rotatePointX,
        this.texture.rotatePointY,
        this.game.ctx,
        0,
        0,
        true
      );
    } else if (this.viewType === "anim") {
      // Update the current frame time with delta time
      this.anim[this.animName].currFrameTime += deltaTime;

      // Check if it's time to switch to the next frame
      if (
        this.anim[this.animName].currFrameTime >=
        this.anim[this.animName].frameTime
      ) {
        // Subtract the frame time from the current frame time
        this.anim[this.animName].currFrameTime -=
          this.anim[this.animName].frameTime;

        // Update the current frame, loop back to the first frame if at the last frame
        this.anim[this.animName].currFrame =
          (this.anim[this.animName].currFrame + 1) %
          this.anim[this.animName].frames;

        // Call a function to stop play when first animation is done
        if (this.anim[this.animName].currFrame === 0) {
          // this.#killAfterFirstAnimation();
          if (this.killAfterFirstAnim) {
            this.#killAfterFirstAnimation();
          }
        }
      }

      if (this.viewType === "anim")
        drawImagePartWithTransform(
          this.anim[this.animName].image,
          this.anim[this.animName].fromX +
            this.anim[this.animName].fromWidth *
              this.anim[this.animName].currFrame,
          this.anim[this.animName].fromY,
          this.anim[this.animName].fromWidth,
          this.anim[this.animName].fromHeight,
          (this.isOriginInCenter ? this.x - this.width / 2 : this.x) -
            this.game.camera.x,
          (this.isOriginInCenter ? this.y - this.height / 2 : this.y) -
            this.game.camera.y,
          this.anim[this.animName].fromWidth,
          this.anim[this.animName].fromHeight,
          this.isFlipX,
          this.isFlipY,
          this.anim[this.animName].rotateDeg,
          this.anim[this.animName].rotatePointX,
          this.anim[this.animName].rotatePointY,
          this.game.ctx,
          0,
          0,
          this.game.isDebug
        );
    }
    // hitbox
    if (this.game.isDebug) {
      drawRectOnMap(
        this.isOriginInCenter ? this.x - this.width / 2 : this.x,
        this.isOriginInCenter ? this.y - this.height / 2 : this.y,
        this.width,
        this.height,
        this.game.ctx,
        this.game.camera
      );
    }
  }

  #killAfterFirstAnimation() {
    console.log("First animation is done.");
    this.viewType = "unset";
    this.anim = null;
    this.animName = "unset";
  }
}
export class Projectile extends Sprite {
  constructor(x, y, width, height, game, velX, velY) {
    super(x, y, width, height, game);

    this.x = x;
    this.y = y;
    this.vel = new Vector(velX, velY);
    this.acc = new Vector(0, 0);
  }

  update() {
    this.x += this.vel.x;
    this.y += this.vel.y;
  }
}

export class Character extends Sprite {
  constructor(x, y, width, height, game) {
    super(x, y, width, height, game);

    this.x = x;
    this.y = y;
    this.vel = new Vector(0, 0);
    this.acc = new Vector(0, 0);
    this.accSpeed = 0.1;
    this.moveSpeed = 1;

    this.controllsType = null; // "WSAD", "LMB", "RMB"

    this.collisionWithSprites = [];
    this.isCollisionWithCollidableTiles = false;

    // this.stats = {
    //   maxHP: 100,
    //   HP: 100,
    //   maxMP: 100,
    //   MP: 100,
    //   attack: 10,
    //   defense: 10,
    //   movementSpeed: 10,
    // };
  }

  // movement based on acceleration

  update() {
    // zmiana animacji
    // TODO: this.setCurrentAnim("idle"); powoduje błąd
    // if (this.currentAnim !== "idle" && this.vel.getLen() === 0) {
    //   this.setCurrentAnim("idle");
    // }
    // if (this.vel.getLen() > 0) {
    //   this.setCurrentAnim("run");
    // }

    // odwrócenie animacji w poziomie
    if (this.vel.x < 0) {
      this.isFlipX = true;
    } else if (this.vel.x > 0) {
      this.isFlipX = false;
    }

    this.collideManager();

    if (this.controllsType === "WSAD") {
      // when i press one of the keys, apply accSpeed value to acc Vector
      if (this.game.keys.key[65]) {
        this.acc.x = -this.accSpeed; // if pressed a
      } else if (this.game.keys.key[68]) {
        this.acc.x = this.accSpeed; // if pressed d
      } else {
        // dont accelerate
        this.acc.x = 0;

        // slow down
        if (this.vel.x > 0) {
          this.vel.x = +(this.vel.x - this.accSpeed).toFixed(2);
          if (this.vel.x < 0.01) this.vel.x = 0; // cut slowing down when he is really slow
        } else if (this.vel.x < 0) {
          this.vel.x = +(this.vel.x + this.accSpeed).toFixed(2);
          if (this.vel.x > 0.01) this.vel.x = 0; // cut slowing down when he is really slow
        }
      }
      if (this.game.keys.key[87]) {
        this.acc.y = -this.accSpeed; // if pressed w
      } else if (this.game.keys.key[83]) {
        this.acc.y = this.accSpeed; // if pressed s
      } else {
        this.acc.y = 0;

        if (this.vel.y > 0) {
          this.vel.y = +(this.vel.y - this.accSpeed).toFixed(2);
          if (this.vel.y < 0.01) this.vel.y = 0; // cut slowing down when he is really slow
        } else if (this.vel.y < 0) {
          this.vel.y = +(this.vel.y + this.accSpeed).toFixed(2);
          if (this.vel.y > 0.01) this.vel.y = 0; // cut slowing down when he is really slow
        }
      }
    } else if (this.controllsType === "LMB" || this.controllsType === "RMB") {
      // poruszanie sie za pomocą kliknięcia używając przyśpieszenia jest troche problematyczne ponieważ postać nie zwalnia gdy jest blisko celu i przez to nie zdąży wychamować.
      // chyba lepiej używać zwygłego poruszania się na bazie velocity.

      //clock happens here
      const click = this.controllsType === "LMB" ? "LMB" : "RMB";

      // set destination point to mouse position depending on click type
      if (
        this.controllsType === "LMB"
          ? this.game.mouse.isMouseDown
          : this.game.mouse.RMB
      ) {
        // creating this.destinationPoint
        this.destinationPoint = new Vector(
          this.game.mouse.x + this.game.camera.x,
          this.game.mouse.y + this.game.camera.y
        );
      }

      // move to destination point
      if (this.destinationPoint) {
        // ------- METODA 1 (PRZYSPIESZENIE) -------
        // get direction
        // const directionAngle = this.destinationPoint
        //   .clone()
        //   .sub({ x: this.x, y: this.y })
        //   .mul(-1, -1)
        //   .getAngleDeg();

        // const tempAcc = new Vector(1, 1);
        // tempAcc.setAngleDeg(directionAngle);
        // tempAcc.setMag(this.accSpeed);

        // this.acc = tempAcc;

        // ------- METODA 2 (PRĘDKOŚĆ) -------
        // creating vector from current position to destination point,
        // normalize it and multiply it by moveSpeed
        const tempVel = this.destinationPoint
          .clone()
          .sub({ x: this.x, y: this.y })
          .normalize();
        tempVel.mul(this.moveSpeed, this.moveSpeed);

        // calculate range to destination point without mutating destination point
        const rangeToDestinationPoint = this.destinationPoint
          .clone()
          .sub({ x: this.x, y: this.y })
          .getLen();

        if (rangeToDestinationPoint < 1) {
          tempVel.set(0, 0);
          this.destinationPoint = null;
        }
        this.vel = tempVel;
      }
    }

    // add acc to vel
    this.vel.add(this.acc);

    // limit vel
    this.vel.limit(this.moveSpeed);

    // add vel to pos
    this.x += this.vel.x;
    this.y += this.vel.y;
  }

  applyKnockback(knockback) {
    this.vel = knockback;
  }

  addStats(maxHP, maxMP, attack, defense, movementSpeed) {
    this.stats = {};
    this.stats.maxHP = maxHP;
    this.stats.HP = maxHP;
    this.stats.maxMP = maxMP;
    this.stats.MP = maxMP;
    this.stats.attack = attack;
    this.stats.defense = defense;
    this.stats.movementSpeed = movementSpeed;

    // chceck if all stats are added, if not console log error
    const statsKeys = Object.keys(this.stats);
    if (statsKeys.length !== 7) {
      console.log("all stats are not added");
    }
  }

  takeDamage(damage) {
    // if hp is less than 0 set hp to 0
    this.stats.HP = Math.max(0, this.stats.HP - damage);
  }

  takeKnockback(vector) {
    if (vector instanceof Vector) {
      this.vel = vector;
    } else {
      console.warn("Not a vector in takeKnockback");
    }
  }

  collideManager() {
    if (this.isCollisionWithCollidableTiles) this.collideWithCollidableTiled();
    // console.log(this.collisionWithSprites.length);
    if (this.collisionWithSprites.length > 0) this.collideWitchSprites();
  }

  mouseMove() {
    // poruszanie sie za pomocą kliknięcia
    let tempVel = new Vector(0, 0); // tymczasowy vector

    if (game.mouse.isMouseDown) {
      tempVel.x = game.mouse.x + game.camera.x - this.x;
      tempVel.y = game.mouse.y + game.camera.y - this.y;
    }

    tempVel.normalize();
    tempVel.mul(0.5, 0.5);

    this.vel = tempVel;
  }

  enableWSADMove() {
    this.controllsType = "WSAD";
  }

  enableMOUSEMove(LMBorRMB) {
    // check only "LMB" or "RMB"
    if (LMBorRMB !== "LMB" && LMBorRMB !== "RMB") {
      console.log("ERROR: LMBorRMB should be 'LMB' or 'RMB'");
      return;
    }

    this.controllsType = LMBorRMB;
  }

  moveToPointWIP(x, y) {
    // nie testowane
    const tempVel = new Vector(x - this.x, y - this.y);
    tempVel.normalize();
    tempVel.mul(0.5, 0.5);
    this.vel = tempVel;
  }

  collideWithCollidableTiled() {
    // this function get collidable, check it and reduce velocity if colliding

    // reset vel to 0 if no key is pressed
    // this.vel.set(0, 0);

    // check if next frame position
    const nextX = this.getNextFramePos(this.x, this.y, this.vel).x;
    const nextY = this.getNextFramePos(this.x, this.y, this.vel).y;

    const closestTiles = {
      top: { length: 0, index: false },
      bottom: { length: 0, index: false },
      left: { length: 0, index: false },
      right: { length: 0, index: false },
    };
    // sprawdź wszystkie collidable
    this.tiled.collidable.forEach((tile, index) => {
      const collision = this.checkCollisionAABBNew(
        nextX,
        nextY,
        this.width,
        this.height,
        tile.x,
        tile.y,
        tile.width,
        tile.height,
        false,
        1
      );

      // oblicz najbliższy tylko z kolidujących
      if (collision.side) {
        // zapisuje jeden najbliższy tile dla każdej strony
        if (
          Math.abs(collision.centerToCenterX) +
            Math.abs(collision.centerToCenterY) <
            closestTiles[collision.side].length ||
          closestTiles[collision.side].length === 0
        ) {
          closestTiles[collision.side].length =
            Math.abs(collision.centerToCenterX) +
            Math.abs(collision.centerToCenterY);
          closestTiles[collision.side].index = index;
        }
      }
    });

    // zmień closestTiles na tablice z indeksami i nazwą strony
    const closestTilesArr = Object.entries(closestTiles);

    // sprawdź kolizje dla najbliższego tile z każdej strony w której aktualnie istnieje
    closestTilesArr.forEach((tile) => {
      if (tile[1].index) {
        const collision = this.checkCollisionAABBNew(
          nextX,
          nextY,
          this.width,
          this.height,
          this.tiled.collidable[tile[1].index].x,
          this.tiled.collidable[tile[1].index].y,
          this.tiled.collidable[tile[1].index].width,
          this.tiled.collidable[tile[1].index].height,
          true
        );
        if (collision.side) {
          // console.log(collision);

          // zablokuj ruch
          if (collision.side === "bottom") {
            // velocity Y nie może być większe od zera
            if (this.vel.y > 0) this.vel.y = 0;
          }
          if (collision.side === "top") {
            // velocity Y nie można być mniejsze od zera
            if (this.vel.y < 0) this.vel.y = 0;
          }
          if (collision.side === "left") {
            // velocity X nie można być mniejsze od zera
            if (this.vel.x < 0) this.vel.x = 0;
          }
          if (collision.side === "right") {
            // velocity X nie można być wieksze od zera
            if (this.vel.x > 0) this.vel.x = 0;
          }
        }
      }
    });
  }

  collideWitchSprites() {
    this.collisionWithSprites.forEach((el) => {
      const coll = this.checkCollisionAABBNew(
        this.x,
        this.y,
        this.width,
        this.height,
        el.x,
        el.y,
        el.width,
        el.height,
        true,
        1
      );

      if (coll.side) {
        // console.log(collision);

        // zablokuj ruch
        if (coll.side === "bottom") {
          // velocity Y nie może być większe od zera
          if (this.vel.y > 0) this.vel.y = 0;
        }
        if (coll.side === "top") {
          // velocity Y nie można być mniejsze od zera
          if (this.vel.y < 0) this.vel.y = 0;
        }
        if (coll.side === "left") {
          // velocity X nie można być mniejsze od zera
          if (this.vel.x < 0) this.vel.x = 0;
        }
        if (coll.side === "right") {
          // velocity X nie można być wieksze od zera
          if (this.vel.x > 0) this.vel.x = 0;
        }
      }
    });
  }

  addCollisionWithSprite(sprite) {
    this.collisionWithSprites.push(sprite);
  }

  addCollisionWithCollidableTiles(tiled) {
    // check if tiled.collidable is not empty
    if (tiled.collidable.length === 0) {
      console.warn(
        "No collidable tiles found in Tiled. Add layer using addLayerToCollidable()."
      );
    } else {
      this.tiled = tiled;
      this.isCollisionWithCollidableTiles = true;
    }
  }

  // // calculate next frame position
  getNextFramePos(posX, posY, vel) {
    return { x: posX + vel.x, y: posY + vel.y };
  }
}

export class Tiled {
  constructor(game, jsonFilePath, image) {
    this.game = game;
    this.jsonData = null;
    this.tilesWithBorders = [];
    this.image = image;

    this.mapSize = null;

    this.collidable = [];
    this.highlight = [];
    // this.preload();

    // before i import json file like this and i have prettier errrors
    // import jsonData from "./gamev11map.json" with { type: "json" };
    //
    // we have to load json file like this
    this.loadJson(jsonFilePath);
  }

  // function that load local json file asynchronously
  async loadJson(path) {
    try {
      console.log(`TILED: Loading JSON file: ${path}`);
      const response = await fetch(path);
      const json = await response.json();

      this.jsonData = json;
      console.log(`TILED: JSON file loaded:`, this.jsonData);
      this.mapSize = this.getMapSize();

      this.tilesWithBorders = this.#getTilesWithBorders(json.tilesets[0]);
    } catch (error) {
      console.error(`Error loading JSON file: ${error}`);
    }
  }

  #getTilesWithBorders(tileset) {
    // find tiles with properties "border"
    const borderTiles = [];
    tileset.tiles.forEach((tile) => {
      // check if tile have object properties
      if (tile.properties) {
        tile.properties.forEach((property) => {
          if (property.name === "border" && property.value === true) {
            // add id to array
            // WARNING: +1 because Tiled make one digit difrence
            borderTiles.push(tile.id + 1);
          }
        });
      }
    });

    console.log(`TILED: Tiles with borders:`, borderTiles);

    return borderTiles;
  }

  // // DISABLED
  // preload() {
  //   // get world bounds
  //   this.mapSize = this.getMapSize(); // need it for draw world bounds
  // }

  // DISABLED
  // getWorldBounds() {
  //   // check if mapSize is null
  //   if (this.mapSize === null) {
  //     console.warn(
  //       "Map size is null. Please set it before getting world bounds."
  //     );
  //     return { x: null, y: null, width: null, height: null };
  //   }
  //   return {
  //     x: 0,
  //     y: 0,
  //     width: this.mapSize.width,
  //     height: this.mapSize.height,
  //   };
  // }

  // DISABLED
  /**
   * Checks if the given object is fully inside the map boundaries.
   *
   * @param {number} x - The x-coordinate of the object's top-left corner.
   * @param {number} y - The y-coordinate of the object's top-left corner.
   * @param {number} width - The width of the object.
   * @param {number} height - The height of the object.
   * @return {boolean} Whether the object is fully inside the map boundaries.
   */
  // isInside(x, y, width, height) {
  //   const worldBounds = this.getWorldBounds();
  //   // chceck if getWorldBounds return null and console.warn
  //   if (worldBounds.x === null) {
  //     console.warn(
  //       "Map size is null. Please set it before checking if object is inside."
  //     );
  //     return false;
  //   }

  //   return (
  //     x >= worldBounds.x &&
  //     x + width <= worldBounds.x + worldBounds.width &&
  //     y >= worldBounds.y &&
  //     y + height <= worldBounds.y + worldBounds.height
  //   );
  // }

  // addLayerToCollidable(layerName) {
  //   // check if jsonData is loaded
  //   if (this.jsonData === null) return;

  //   const layer = this.jsonData.layers.filter((el) => el.name === layerName)[0];

  //   layer.chunks.forEach((chunk) => {
  //     chunk.data.forEach((el, index) => {
  //       if (el !== 0) {
  //         const pos = this.get2dPosFrom1dArray(index, 16);
  //         this.collidable.push({
  //           x: pos.x * 16 + chunk.x * 16,
  //           y: pos.y * 16 + chunk.y * 16,
  //           width: 16,
  //           height: 16,
  //         });
  //       }
  //     });
  //   });
  // }

  //DISABLED
  // drawDebug() {
  //   if (!this.game.isDebug) return;

  //   // draw world bounds
  //   // check if mapSize is null
  //   if (this.mapSize === null) {
  //     console.warn(
  //       "Map size is null. Please set it before drawing world bounds."
  //     );
  //   } else {
  //     drawRectOnMap(
  //       0,
  //       0,
  //       this.mapSize.width,
  //       this.mapSize.height,
  //       this.game.ctx,
  //       this.game.camera
  //     );
  //   }

  //   // draw collidable
  //   this.collidable.forEach((el) =>
  //     drawRectOnMap(el.x, el.y, 16, 16, this.game.ctx, this.game.camera)
  //   );

  //   // draw highlight
  //   this.highlight.forEach((el) =>
  //     drawRectOnMap(
  //       el.x,
  //       el.y,
  //       el.width,
  //       el.height,
  //       this.game.ctx,
  //       this.game.camera,
  //       "red"
  //     )
  //   );

  //   // highlight tile
  // }

  // highlightTiles(tiles) {
  //   this.highlight = tiles;
  // }

  getMapSize() {
    // Pobiera rozmiar mapy na podstawie ostatniego chunka w każdej warstwie.
    let width = 0;
    let height = 0;
    let startX = 0;
    let startY = 0;

    const tileHeight = this.jsonData.tileheight;
    const tileWidth = this.jsonData.tilewidth;

    this.jsonData.layers.forEach((layer) => {
      width = Math.max(width, layer.width);
      height = Math.max(height, layer.height);
      startX = Math.min(startX, layer.startx);
      startY = Math.min(startY, layer.starty);
    });

    const mapSize = {
      dimensionsTiles: { width, height },
      bordersPositions: {
        top: startY * tileHeight,
        left: startX * tileWidth,
        right: (startX + width) * tileWidth,
        bottom: (startY + height) * tileHeight,
      },
    };

    console.log(`Map size: `, mapSize);

    return mapSize;
  }

  #getTilePosFromSpritesheet(
    id,
    tilesetsColumns,
    tilesetsTileWidth,
    tilkesetsTileHeight
  ) {
    // TODO: dodać wyszukiwanie tileset po nazwie "name":"spritesheet",

    const row = Math.floor((id - 1) / tilesetsColumns);
    const column = id - 1 - row * tilesetsColumns;

    return { x: column * tilesetsTileWidth, y: row * tilkesetsTileHeight };
  }

  drawLayer(layerName, playerX, playerY) {
    // check if jsonData is loaded
    if (this.jsonData === null) {
      console.warn("json file is no loaded yet, skipping drawLayer");
      return;
    }

    // check if layer exists
    if (
      this.jsonData.layers.filter((el) => el.name === layerName).length === 0
    ) {
      console.warn("layer ", layerName, "not found, skipping drawLayer");
      return;
    }

    // find layer
    const layer = this.jsonData.layers.filter((el) => el.name === layerName)[0];

    let counter = 0;
    for (let i = 0; i < layer.chunks.length; i++) {
      // draw only chunk that player is in and chunks around it
      if (
        this.#isSomethingIsInChunk(layer.chunks[i], playerX, playerY) ||
        this.#isSomethingIsInChunk(
          layer.chunks[i],
          playerX - 16 * 16,
          playerY
        ) ||
        this.#isSomethingIsInChunk(
          layer.chunks[i],
          playerX + 16 * 16,
          playerY
        ) ||
        this.#isSomethingIsInChunk(
          layer.chunks[i],
          playerX,
          playerY - 16 * 16
        ) ||
        this.#isSomethingIsInChunk(
          layer.chunks[i],
          playerX,
          playerY + 16 * 16
        ) ||
        this.#isSomethingIsInChunk(
          layer.chunks[i],
          playerX - 16 * 16,
          playerY - 16 * 16
        ) ||
        this.#isSomethingIsInChunk(
          layer.chunks[i],
          playerX + 16 * 16,
          playerY - 16 * 16
        ) ||
        this.#isSomethingIsInChunk(
          layer.chunks[i],
          playerX - 16 * 16,
          playerY + 16 * 16
        ) ||
        this.#isSomethingIsInChunk(
          layer.chunks[i],
          playerX + 16 * 16,
          playerY + 16 * 16
        )
      ) {
        let tilesCounter = this.#drawChunk(
          layer.chunks[i],
          this.jsonData.tilesets[0],
          this.image
        );
        counter += tilesCounter;
      }
    }
    return counter;
  }

  #isSomethingIsInChunk(chunk, smtngX, smtngY) {
    // check if smtng is in chunk
    if (
      smtngX >= chunk.x * 16 &&
      smtngX <= chunk.x * 16 + chunk.width * 16 &&
      smtngY >= chunk.y * 16 &&
      smtngY <= chunk.y * 16 + chunk.height * 16
    ) {
      return true;
    }
  }

  #drawChunk(chunk, tileset) {
    // this function draw chunk in correct position => chunk.x and chunk.y,
    // so you dont have to specify where to draw this

    // console.log(this.game.camera.x, this.game.camera.y);
    // chunk position
    const chunkX = chunk.x * tileset.tilewidth;
    const chunkY = chunk.y * tileset.tileheight;

    let counter = 0;

    for (let i = 0; i < chunk.data.length; i++) {
      const row = Math.floor(i / chunk.width);
      const column = i - row * chunk.width;

      if (chunk.data[i] !== 0) {
        const tilePos = this.#getTilePosFromSpritesheet(
          chunk.data[i],
          tileset.columns,
          tileset.tilewidth,
          tileset.tileheight
        );

        const borderWidth = 1;
        // check if tile have properties
        const id = chunk.data[i];

        if (this.tilesWithBorders.includes(id)) {
          // draw this tile bigger
          this.game.ctx.drawImage(
            this.image,
            tilePos.x - borderWidth,
            tilePos.y - borderWidth,
            tileset.tilewidth + borderWidth * 2,
            tileset.tileheight + borderWidth * 2,
            chunkX +
              column * tileset.tilewidth -
              this.game.camera.x -
              borderWidth,
            chunkY +
              row * tileset.tileheight -
              this.game.camera.y -
              borderWidth,
            tileset.tilewidth + borderWidth * 2,
            tileset.tileheight + borderWidth * 2
          );
        } else {
          // draw this tile normal
          this.game.ctx.drawImage(
            this.image,
            tilePos.x,
            tilePos.y,
            tileset.tilewidth,
            tileset.tileheight,
            chunkX + column * tileset.tilewidth - this.game.camera.x,
            chunkY + row * tileset.tileheight - this.game.camera.y,
            tileset.tilewidth,
            tileset.tileheight
          );
        }
        // count how many times draw tile
        counter++;
      }
    }

    return counter;
  }

  drawWorldBorders() {
    // skip drawing until json is loaded
    if (this.jsonData === null) {
      console.warn("json file is no loaded yet, skipping drawWorldBorders");
      return;
    }

    drawRectOnMap(
      this.mapSize.bordersPositions.left,
      this.mapSize.bordersPositions.top,
      this.mapSize.dimensionsTiles.width * 16,
      this.mapSize.dimensionsTiles.height * 16,
      this.game.ctx,
      this.game.camera,
      "red",
      5
    );
  }

  // getChunkIndex(myX, myY, layerIndex, jsonData) {
  //   const tileX = Math.floor(myX / 16);
  //   const tileY = Math.floor(myY / 16);

  //   // TODO: on przeszukuje pierwszy layer, jeśli był by mniejszy (nie wiem czy to możliwe) to zwróci błędny chunk
  //   // TODO: 16 jest hardcoded a nie powinno
  //   const index = jsonData.layers[layerIndex].chunks.findIndex(
  //     (el) =>
  //       tileX >= el.x &&
  //       tileX <= el.x + el.width &&
  //       tileY >= el.y &&
  //       tileY <= el.y + el.height
  //   );

  //   return index;
  //   // console.log(index);
  // }
}

// Vector

export class Vector {
  /**
   * @param {number} x The x-coordinate.
   * @param {number} y The y-coordinate.
   */
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  /**
   * @param {number} x The new x-coordinate.
   * @param {number} y The new y-coordinate.
   */
  set(x, y) {
    this.x = x;
    this.y = y;
  }

  /**
   * @param {Vector} vector The vector to add to this vector.
   */
  add(vector) {
    this.x += vector.x;
    this.y += vector.y;
  }

  clone() {
    return new Vector(this.x, this.y);
  }

  sub(vector) {
    this.x -= vector.x;
    this.y -= vector.y;

    return this;
    // this.x -= x;
    // this.y -= y;
  }

  /**
   * @param {number} x The value to multiply the x-coordinate by.
   * @param {number} y The value to multiply the y-coordinate by.
   */
  mul(x, y) {
    this.x *= x;
    this.y *= y;

    return this;
  }

  /**
   * @param {number} x The value to divide the x-coordinate by.
   * @param {number} y The value to divide the y-coordinate by.
   */
  div(x, y) {
    this.x /= x;
    this.y /= y;
  }

  /**
   * @returns {number} The magnitude of the vector.
   */
  getLen() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  normalize() {
    const len = this.getLen();
    if (len !== 0) {
      this.x /= len;
      this.y /= len;

      return this;
    } else {
      // console.log("Tried to normalize a zero-length vector.");
    }
  }

  /**
   * @param {number} max The maximum magnitude.
   */
  limit(max) {
    if (this.getLen() > max) {
      this.normalize();
      this.mul(max, max);

      return this;
    } else if (max === undefined) {
      console.log("No max value provided.");
    }
  }

  /**
   * @returns {Vector} A new vector with the same coordinates.
   */
  getClone() {
    return new Vector(this.x, this.y);
  }

  /**
   * @param {number} mag The new magnitude.
   */
  setMag(mag) {
    this.normalize();
    this.mul(mag, mag);
    return this;
  }

  /**
   * @param {Vector} v2 The other vector.
   * @returns {number} The distance between this vector and the other vector.
   */
  getDistance(v2) {
    const dx = this.x - v2.x;
    const dy = this.y - v2.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * @returns {Vector} A new vector with the same coordinates.
   */
  getCopy() {
    return new Vector(this.x, this.y);
  }

  /**
   * @returns {number} The magnitude of the vector.
   */
  getMag() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  /**
   * @returns {number} The angle of the vector in radians.
   */
  getHeading() {
    return Math.atan2(this.y, this.x);
  }

  /**
   * @param {number} angle The new angle in degrees.
   */
  setAngleDeg(angle) {
    if (angle !== undefined) {
      const mag = this.getMag();
      const rad = (angle * Math.PI) / 180;
      this.set(Math.cos(rad), Math.sin(rad));
      this.setMag(mag);
      return this;
    } else {
      console.log("No angle value provided.");
    }
  }

  /**
   * @param {number} angle The new angle in radians.
   */
  setAngleRad(angle) {
    if (angle !== undefined) {
      const rad = angle;
      this.set(Math.cos(rad), Math.sin(rad));
    } else {
      console.log("No angle value provided.");
    }
  }

  /**
   * @returns {number} The angle of the vector in degrees.
   */
  getAngleDeg() {
    const rad = Math.atan2(this.y, this.x);
    return (((rad + Math.PI) * 180) / Math.PI) % 360;
  }

  /**
   * @returns {number} The angle of the vector in radians.
   */
  getAngleRad() {
    const rad = Math.atan2(this.y, this.x);
    return rad;
  }

  /**
   * @param {number} angle The angle in degrees to rotate by.
   */
  rotate(angle) {
    if (angle !== undefined) {
      const rad = (angle * Math.PI) / 180;
      const x = this.x * Math.cos(rad) - this.y * Math.sin(rad);
      const y = this.x * Math.sin(rad) + this.y * Math.cos(rad);
      this.set(x, y);
    } else {
      console.log("No angle value provided.");
    }
  }

  /**
   * @returns {Vector} A new unit vector.
   */
  static randomUnitVector() {
    const random1 = Math.random() * 2 - 1;
    const random2 = Math.random() * 2 - 1;
    const magnitude = Math.sqrt(random1 ** 2 + random2 ** 2);
    const unitX = random1 / magnitude;
    const unitY = random2 / magnitude;
    return new Vector(unitX, unitY);
  }
}

// FUNCTIONS

/**
 * const bigSpritev7 = new Image();
 * bigSpritev7.src = "BigSpritev7.png";
 */

/**
 * Draws a transformed image part on the canvas.
 *
 * @param {Object} image - The image object to draw.
 * @param {number} sx - The x-coordinate of the upper-left corner of the source image.
 * @param {number} sy - The y-coordinate of the upper-left corner of the source image.
 * @param {number} sWidth - The width of the source image.
 * @param {number} sHeight - The height of the source image.
 * @param {number} dx - The x-coordinate in the destination canvas at which to place the top-left corner of the source image.
 * @param {number} dy - The y-coordinate in the destination canvas at which to place the top-left corner of the source image.
 * @param {number} dWidth - The width to draw the image on the destination canvas.
 * @param {number} dHeight - The height to draw the image on the destination canvas.
 * @param {boolean} isFlipX - Indicates if the image should be flipped horizontally.
 * @param {boolean} isFlipY - Indicates if the image should be flipped vertically.
 * @param {number} rotationDeg - The degree of rotation for the image.
 * @param {number} rotationOriginX - The x-coordinate of the rotation pivot point.
 * @param {number} rotationOriginY - The y-coordinate of the rotation pivot point.
 * @param {Object} ctx - The canvas rendering context.
 * @param {number} cameraX - The x-coordinate of the camera.
 * @param {number} cameraY - The y-coordinate of the camera.
 * @param {boolean} isDebug - Indicates if debug mode is enabled.
 * @return {void}
 */
export function drawImagePartWithTransform(
  image,
  sx,
  sy,
  sWidth,
  sHeight,
  dx,
  dy,
  dWidth,
  dHeight,
  isFlipX,
  isFlipY,
  rotationDeg,
  rotationOriginX,
  rotationOriginY,
  ctx,
  cameraX,
  cameraY,
  isDebug
) {
  // sprawdź czy są wszystkie potrzebne zmienne
  if (
    !image ||
    typeof sx !== "number" ||
    typeof sy !== "number" ||
    typeof sWidth !== "number" ||
    typeof sHeight !== "number" ||
    typeof dx !== "number" ||
    typeof dy !== "number" ||
    typeof dWidth !== "number" ||
    typeof dHeight !== "number" ||
    typeof isFlipX !== "boolean" ||
    typeof isFlipY !== "boolean" ||
    typeof rotationDeg !== "number" ||
    typeof rotationOriginX !== "number" ||
    typeof rotationOriginY !== "number" ||
    typeof ctx !== "object" ||
    typeof cameraX !== "number" ||
    typeof cameraY !== "number" ||
    typeof isDebug !== "boolean"
  ) {
    console.error("drawImagePartWithTransform: Invalid argument(s).");
  }
  // Zapamiętaj obecne ustawienia transformacji
  ctx.save();

  // Ustaw pivot jako punkt obracania
  ctx.translate(
    rotationOriginX + dx + sWidth / 2 - cameraX,
    rotationOriginY + dy + sHeight / 2 - cameraY
  );

  // Obróć obraz o podaną ilość stopni
  ctx.rotate((rotationDeg * Math.PI) / 180);

  // Odbij obraz w osi X, jeśli wymagane
  if (isFlipX) ctx.scale(-1, 1);

  // Odbij obraz w osi Y, jeśli wymagane
  if (isFlipY) ctx.scale(1, -1);

  // Przesuń punkt obrotu z powrotem do początkowego punktu
  ctx.translate(
    -(rotationOriginX + dx + sWidth / 2),
    -(rotationOriginY + dy + sHeight / 2)
  );

  // Narysuj konkretną część obrazka na canvasie
  ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);

  // Rysuj punkt obrotu
  if (isDebug) {
    ctx.strokeStyle = "red";
    ctx.beginPath();
    ctx.arc(
      rotationOriginX + dx + sWidth / 2,
      rotationOriginY + dy + sHeight / 2,
      0.1, // Promień punktu obrotu
      0,
      Math.PI * 2
    );
    ctx.closePath();
    ctx.stroke();
    ctx.strokeStyle = "black";
  }

  // Przywróć poprzednie ustawienia transformacji
  ctx.restore();
}

// draw rectangle on map
export function drawRectOnMap(
  x,
  y,
  width,
  height,
  ctx,
  camera,
  color = "black",
  lineWidth = 1
) {
  // Hard type checks and NaN checks for all parameters
  if (
    typeof x !== "number" ||
    isNaN(x) ||
    typeof y !== "number" ||
    isNaN(y) ||
    typeof width !== "number" ||
    isNaN(width) ||
    typeof height !== "number" ||
    isNaN(height) ||
    typeof ctx !== "object" ||
    typeof camera !== "object" ||
    typeof color !== "string" ||
    typeof lineWidth !== "number" ||
    isNaN(lineWidth)
  ) {
    console.error("drawRectOnMap: Invalid argument(s).");
    return;
  }

  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.rect(x - camera.x, y - camera.y, width, height);
  ctx.stroke();
  ctx.closePath();
  ctx.strokeStyle = "black";
  ctx.lineWidth = 1;
}

export function drawLineOnMap(
  x1,
  y1,
  x2,
  y2,
  ctx,
  camera,
  color = "black",
  lineWidth = 1
) {
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(x1 - camera.x, y1 - camera.y);
  ctx.lineTo(x2 - camera.x, y2 - camera.y);
  ctx.stroke();
  ctx.closePath();
  ctx.strokeStyle = "black";
  ctx.lineWidth = 1;
}

export function drawCircleOnMap(
  x,
  y,
  radius,
  ctx,
  camera,
  color = "black",
  lineWidth = 1
) {
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  ctx.arc(x - camera.x, y - camera.y, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.closePath();
  ctx.strokeStyle = "black";
  ctx.lineWidth = 1;
}

export function isLineRectCollision(x1, y1, x2, y2, rx, ry, rw, rh, game) {
  // check if the line has hit any of the rectangle's sides
  // uses the Line/Line function below
  const left = isLineLineCollision(x1, y1, x2, y2, rx, ry, rx, ry + rh, game);
  const right = isLineLineCollision(
    x1,
    y1,
    x2,
    y2,
    rx + rw,
    ry,
    rx + rw,
    ry + rh,
    game
  );
  const top = isLineLineCollision(x1, y1, x2, y2, rx, ry, rx + rw, ry, game);
  const bottom = isLineLineCollision(
    x1,
    y1,
    x2,
    y2,
    rx,
    ry + rh,
    rx + rw,
    ry + rh,
    game
  );

  // if ANY of the above are true, the line
  // has hit the rectangle
  return left || right || top || bottom;
}

// LINE/LINE
export function isLineLineCollision(x1, y1, x2, y2, x3, y3, x4, y4, game) {
  // calculate the direction of the lines
  const uA =
    ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) /
    ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
  const uB =
    ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) /
    ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));

  // if uA and uB are between 0-1, lines are colliding
  if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
    // optionally, draw a circle where the lines meet
    if (game.isDebug) {
      const intersectionX = x1 + uA * (x2 - x1);
      const intersectionY = y1 + uA * (y2 - y1);

      drawCircleOnMap(
        intersectionX,
        intersectionY,
        3,
        game.ctx,
        game.camera,
        "red",
        2
      );

      // draw thes lines
      drawLineOnMap(x1, y1, x2, y2, game.ctx, game.camera);
      drawLineOnMap(x3, y3, x4, y4, game.ctx, game.camera);
    }

    return true;
  }
  return false;
}

export function drawTextOnMap(text, x, y, game) {
  game.ctx.font = "10px Arial";
  game.ctx.fillStyle = "black";
  game.ctx.fillText(text, x - game.camera.x, y - game.camera.y);
}

export function drawText(text, x, y, game) {
  game.ctx.font = "10px Arial";
  game.ctx.fillStyle = "black";
  game.ctx.fillText(text, x, y);
}

export function drawRect(
  x,
  y,
  w,
  h,
  game,
  color = "black",
  lineWidth = 1,
  fill = false
) {
  game.ctx.fillStyle = color;
  game.ctx.strokeStyle = color;
  game.ctx.lineWidth = lineWidth;
  game.ctx.beginPath();
  game.ctx.rect(x / 2, y / 2, w / 2, h / 2);
  if (fill) {
    game.ctx.fill();
  } else {
    game.ctx.stroke();
  }
  game.ctx.closePath();
}

/**
 * @description
 *   Generates 2D position from 1D array index.
 *
 * @param {number} index
 *   1D array index.
 * @param {number} columns
 *   Number of columns in 2D array.
 *
 * @returns {{x: number, y: number}}
 *   2D position.
 */
export function get2dPosFrom1dArray(index, columns) {
  const x = index % columns;
  const y = Math.floor(index / columns);
  return { x, y };
}
