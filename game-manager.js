class GameManager {
  constructor(numSaucers) {
    this.numSaucers = numSaucers;
    this.score;
    this.level;
    this.numLives;
    this.asteroids = [];
    this.ship;
    this.saucers = [];
    this.spaceDown = false;
    this.shipBullets = [];
    this.saucerBullets = [];
    this.AsteroidSize = { SMALL: 20, MEDIUM: 50, LARGE: 80 };
    this.AsteroidValue = { SMALL: 80, MEDIUM: 50, LARGE: 20 };
    this.AsteroidSpeed = { SMALL: 1.5, MEDIUM: 1, LARGE: 0.5 };
    this.SaucerSize = { SMALL: 15, LARGE: 35 };
    this.asteroidOffsetSpawn = 15;
    this.lastScoreAddLife = 0;
    this.lastScoreBigSaucer = 0;
    this.lastScoreSmallSaucer = 0;
    this.ADD_LIFE_MILESTONE = 10000;
    this.SPAWN_BIG_SAUCER_MILESTONE = 800;
    this.SPAWN_SMALL_SAUCER_MILESTONE = 2500;
    this.gameIsOver = false;
    this.music = createAudio("assets/sfx/music.mp3");
    this.Sound = {
      DEATH: createAudio("assets/sfx/death.mp3"),
      EXPLODE: createAudio("assets/sfx/explode.mp3"),
      GAMEOVER: createAudio("assets/sfx/game-over.mp3"),
      GAMESTART: createAudio("assets/sfx/game-start.mp3"),
      SHOOT: createAudio("assets/sfx/shoot.mp3"),
      TELEPORT: createAudio("assets/sfx/teleport.mp3"),
      THRUST: createAudio("assets/sfx/thrust.mp3"),
      SAUCER_APPEAR: createAudio("assets/sfx/saucer-appear.mp3"),
    };
  }

  startGame() {
    //Loop the music
    this.music.loop();

    //Game properties set to beginning properties
    this.score = 0;
    this.level = 1;
    this.numLives = 3;
    this.gameIsOver = false;

    this.spawnShip();

    for (let i = 0; i < this.level; i++) {
      let position = createVector(random(windowWidth), random(windowHeight));
      this.spawnAsteroid(
        position,
        this.AsteroidSize.LARGE,
        this.AsteroidSpeed.LARGE
      );
    }
  }

  update() {
    if (this.gameIsOver) {
      this.displayGameOverScreen();
      return;
    }

    //Ship Bullets
    for (let i = 0; i < this.shipBullets.length; i++) {
      this.shipBullets[i].update();
      this.shipBullets[i].display();

      //If the ship bullet is destroyed, then remove it from the array
      if (!this.shipBullets[i].getVisibility()) {
        this.shipBullets.splice(i, 1);
      }
    }

    //Saucer Bullets
    for (let i = 0; i < this.saucerBullets.length; i++) {
      this.saucerBullets[i].update();
      this.saucerBullets[i].display();

      //If the saucer bullet is destroyed, then remove it from the array
      if (!this.saucerBullets[i].getVisibility()) {
        this.saucerBullets.splice(i, 1);
      }
    }

    //Ship
    if (this.ship) {
      this.processInput();
      this.ship.update();
      this.ship.display();
    }

    //Asteroids
    for (let i = 0; i < this.asteroids.length; i++) {
      this.asteroids[i].update();
      this.asteroids[i].display();

      //Destroys asteroid if hit
      this.handleCollision(this.asteroids[i], i);
    }

    //Saucers
    for (let i = 0; i < this.saucers.length; i++) {
      this.saucers[i].update();
      this.saucers[i].display();

      if (this.saucers[i].getReadyToShoot()) {
        this.saucers[i].shoot();
        this.saucerBullets.push(this.saucers[i].getBulletType());
      }
    }

    //HUD
    this.displayHUD();
  }

  handleCollision(actor, position) {
    let spawnSmallerAsteroids = false;
    let noMoreAsteroids = false;

    //Check collision if actor is hitting the bullets
    for (let j = 0; j < this.shipBullets.length; j++) {
      let distBetween = actor
        .getPosition()
        .dist(this.shipBullets[j].getPosition());

      let collideDistance =
        actor.getSize() / 2 + this.shipBullets[j].getSize() / 2;

      //If colliding with the ship's bullets
      if (distBetween <= collideDistance) {
        //Destroy ship bullets
        this.shipBullets[j].setVisible(false);
        this.shipBullets.splice(j, 1);

        spawnSmallerAsteroids = true;

        //Destroy this actor
        actor.setVisible(false);
        this.asteroids.splice(position, 1);
        this.Sound.EXPLODE.stop();
        this.Sound.EXPLODE.play();

        //If the last asteroid just got destroyed
        if (
          actor.getSize() === this.AsteroidSize.SMALL &&
          this.asteroids.length <= 0
        ) {
          noMoreAsteroids = true;
        }

        //Add to the total score
        switch (actor.getSize()) {
          case this.AsteroidSize.LARGE:
            this.score += this.AsteroidValue.LARGE;
            break;
          case this.AsteroidSize.MEDIUM:
            this.score += this.AsteroidValue.MEDIUM;
            break;
          case this.AsteroidSize.SMALL:
            this.score += this.AsteroidValue.SMALL;
            break;
        }

        //Gain an extra life for every 10,000 points scored
        if (this.score - this.lastScoreAddLife >= this.ADD_LIFE_MILESTONE) {
          this.lastScoreAddLife += this.ADD_LIFE_MILESTONE;
          this.numLives++;
        }

        //Spawn a big saucer for every 800 points scored
        //Spawn a small saucer for every 2500 points scored
        if (
          this.score - this.lastScoreSmallSaucer >=
          this.SPAWN_SMALL_SAUCER_MILESTONE
        ) {
          this.lastScoreSmallSaucer += this.SPAWN_SMALL_SAUCER_MILESTONE;
          this.spawnSaucer(this.SaucerSize.SMALL);
        } else if (
          this.score - this.lastScoreBigSaucer >=
          this.SPAWN_BIG_SAUCER_MILESTONE
        ) {
          this.lastScoreBigSaucer += this.SPAWN_BIG_SAUCER_MILESTONE;
          this.spawnSaucer(this.SaucerSize.LARGE);
        }
      }
    }

    //Check collision if actor is hitting the ship
    let distBetween = actor.getPosition().dist(this.ship.getPosition());
    let collideDist = actor.getSize() / 2 + this.ship.getSize() / 2;

    //If colliding with the ship
    if (distBetween <= collideDist && !this.ship.getInvincible()) {
      //Destroy this actor
      actor.setVisible(false);
      this.asteroids.splice(position, 1);

      //Reduce the number of lives
      this.numLives--;

      //Respawn the ship if they still have a life
      if (this.numLives >= 1) {
        //this.spawnShip();           /--------------------------------------------------
        this.ship.respawn();
        this.Sound.DEATH.stop();
        this.Sound.DEATH.play();
      } else {
        this.gameIsOver = true;
        this.music.stop();
        this.Sound.GAMEOVER.play();
      }

      //If the last asteroid just got destroyed
      if (
        actor.getSize() === this.AsteroidSize.SMALL &&
        this.asteroids.length <= 0
      ) {
        noMoreAsteroids = true;
      }

      spawnSmallerAsteroids = true;
    }

    //Spawn two smaller asteroids if asteroid was hit and not the smallest size
    if (actor.getSize() != this.AsteroidSize.SMALL && spawnSmallerAsteroids) {
      let pos1 = createVector(
        -this.asteroidOffsetSpawn + 2 * random(this.asteroidOffsetSpawn),
        -this.asteroidOffsetSpawn + 2 * random(this.asteroidOffsetSpawn)
      ).add(actor.getPosition());
      let pos2 = createVector(
        -this.asteroidOffsetSpawn + 2 * random(this.asteroidOffsetSpawn),
        -this.asteroidOffsetSpawn + 2 * random(this.asteroidOffsetSpawn)
      ).add(actor.getPosition());

      let size =
        actor.getSize() == this.AsteroidSize.LARGE
          ? this.AsteroidSize.MEDIUM
          : this.AsteroidSize.SMALL;

      let speed =
        actor.getSize() == this.AsteroidSize.LARGE
          ? this.AsteroidSpeed.MEDIUM
          : this.AsteroidSpeed.SMALL;

      this.spawnAsteroid(pos1, size, speed);
      this.spawnAsteroid(pos2, size, speed);
    }

    //Spawn asteroids if there are no more asteroids and go to next level

    if (noMoreAsteroids) {
      this.level++;
      for (let i = 0; i < this.level; i++) {
        let position = createVector(random(windowWidth), random(windowHeight));
        this.spawnAsteroid(
          position,
          this.AsteroidSize.LARGE,
          this.AsteroidSpeed.LARGE
        );
      }
    }
    console.log(noMoreAsteroids);
  }

  processInput() {
    //'A' is pressed
    if (keyIsDown(65) || keyIsDown(37)) {
      this.ship.rotateCounterClockwise();
    }

    //'D' is pressed
    if (keyIsDown(68) || keyIsDown(39)) {
      this.ship.rotateClockwise();
    }

    //'W' is pressed
    if (keyIsDown(87) || keyIsDown(38)) {
      this.ship.thrustForward();
      this.Sound.THRUST.play();
    } else {
      this.ship.setIsMovingForward(false);
      this.Sound.THRUST.stop();
    }

    //'S' is pressed
    if ((keyIsDown(83) || keyIsDown(40)) && !this.ship.getTeleportActive()) {
      this.ship.teleport();
      this.Sound.TELEPORT.stop();
      this.Sound.TELEPORT.play();
    }

    //Space Bar is pressed
    if (keyIsDown(32) && !this.ship.getTeleportActive() && !this.spaceDown) {
      this.spaceDown = true;

      this.spawnBullet();
      this.Sound.SHOOT.stop();
      this.Sound.SHOOT.play();
    } else if (!keyIsDown(32) && !this.ship.getTeleportActive()) {
      this.spaceDown = false;
    }
  }

  spawnBullet() {
    //Bullet Properties:
    const size = 3;
    const speed = 13;
    const position = this.ship.getBulletPosition();
    const rotation = this.ship.getRotation();
    const lifeTime = 1000;

    let bullet = new Bullet(position, size, rotation, speed, lifeTime);
    this.shipBullets.push(bullet);
  }

  spawnShip() {
    //Ship Properties:
    const size = 20;
    const rotationSpeed = 0.1;
    const thrustPower = 0.3;
    const dragForce = 0.97;
    const position = createVector(width / 2, height / 2);
    const rotation = -PI / 2;

    //Create the Spaceship
    this.ship = new Ship(
      position,
      size,
      rotation,
      rotationSpeed,
      thrustPower,
      dragForce
    );
  }

  spawnSaucer(size) {
    //Random Y position from 20% to 80% of the screen height
    let randomY = random(windowHeight * 0.2, windowHeight * 0.8);
    let pos = createVector(-size / 2, randomY);
    let moveSpeed = 1;

    let saucer = new Saucer(pos, size, moveSpeed, this.ship);

    //Set Up Its Shape
    saucer.setupShape();

    //Add to the array of saucers
    this.saucers.push(saucer);
  }

  spawnAsteroid(position, size, speed) {
    //Asteroid Properties:
    const rotation = random(TWO_PI);
    const numVertices = 20;
    const shapeStrength = 0.12;

    //Create the Asteroid
    let asteroid = new Asteroid(
      position,
      size,
      rotation,
      speed,
      numVertices,
      shapeStrength
    );

    //Set Up Its Shape
    asteroid.setupShape();

    //Add to the Asteroids Array
    this.asteroids.push(asteroid);
  }

  //Displays the player's score and the number of lives left
  displayHUD() {
    const offsetFromEdge = 50;

    fill(255);
    textSize(20);

    //Score Text (Displayed at the top-left)
    text("SCORE: " + this.score, windowWidth * 0.1, offsetFromEdge);

    //Level Text (Displayed at the top-right)
    text("LEVEL: " + this.level, windowWidth * 0.9, offsetFromEdge);

    //Number of Lives Text
    text(
      "NUMBER OF LIVES: " + this.numLives,
      windowWidth / 2,
      windowHeight - offsetFromEdge
    );
  }

  //Displays the game over screen and the score
  displayGameOverScreen() {
    let scoreTextOffset = 50;

    fill(255);
    textSize(60);
    text("GAME OVER!", windowWidth / 2, windowHeight / 2);
    textSize(20);
    text(
      "YOUR TOTAL SCORE: " + this.score,
      windowWidth / 2,
      windowHeight / 2 + scoreTextOffset
    );
    this.Sound.THRUST.stop();
  }
}
