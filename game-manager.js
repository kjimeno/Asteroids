class GameManager {
  constructor() {
    this.collisionHandler;
    this.uiHandler = new UIHandler();
    this.score;
    this.level;
    this.gameStarted = false;
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
    this.SaucerValue = { SMALL: 100, LARGE: 50 };
    this.asteroidOffsetSpawn = 15;
    this.lastScoreAddLife = 0;
    this.lastScoreBigSaucer = 0;
    this.lastScoreSmallSaucer = 0;
    this.ADD_LIFE_MILESTONE = 10000;
    this.SPAWN_BIG_SAUCER_MILESTONE = 700;
    this.SPAWN_SMALL_SAUCER_MILESTONE = 1500;
    this.gameIsOver = false;
    this.music = createAudio("assets/sfx/music.mp3");
    this.Sounds = {
      DEATH: createAudio("assets/sfx/death.mp3"),
      EXPLODE: createAudio("assets/sfx/explode.mp3"),
      GAMEOVER: createAudio("assets/sfx/game-over.mp3"),
      GAMESTART: createAudio("assets/sfx/game-start.mp3"),
      SHOOT: createAudio("assets/sfx/shoot.mp3"),
      TELEPORT: createAudio("assets/sfx/teleport.mp3"),
      THRUST: createAudio("assets/sfx/thrust.mp3"),
      SAUCER_APPEAR: createAudio("assets/sfx/saucer-appear.mp3"),
      SAUCER_EXPLODE: createAudio("assets/sfx/saucer-explode.mp3"),
    };
  }

  startGame() {
    //Starting amount of asteroids
    const initNumAsteroids = 4;

    cursor(ARROW);

    //Loop the music
    this.music.loop();

    //Game properties set to beginning properties
    this.score = 0;
    this.level = 1;
    this.numLives = 5;
    this.gameIsOver = false;

    //Reset all the arrays
    this.saucers = [];
    this.saucerBullets = [];
    this.asteroids = [];
    this.shipBullets = [];

    this.spawnShip();

    this.collisionHandler = new CollisionHandler(this);

    for (let i = 1; i < this.level + initNumAsteroids; i++) {
      let position = createVector(random(windowWidth), random(windowHeight));
      this.spawnAsteroid(
        position,
        this.AsteroidSize.LARGE,
        this.AsteroidSpeed.LARGE
      );
    }
  }

  update() {
    if (!this.gameStarted) {
      this.uiHandler.displayTitleScreen(this);
      return;
    }

    if (this.gameIsOver) {
      this.uiHandler.displayGameOverScreen(
        this.score,
        this.Sounds.THRUST,
        this
      );
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
    }

    //Saucers
    for (let i = 0; i < this.saucers.length; i++) {
      this.saucers[i].update(this.asteroids, this.ship);
      this.saucers[i].display();

      if (this.saucers[i].getReadyToShoot()) {
        this.saucers[i].shoot();
        this.saucerBullets.push(
          this.saucers[i].getBulletType(
            this.score,
            this.SPAWN_SMALL_SAUCER_MILESTONE,
            this.ship
          )
        );
      }
    }

    //Handle collisions
    this.collisionHandler.update();

    //HUD
    this.uiHandler.displayHUD(this.score, this.level, this.numLives);
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
      this.Sounds.THRUST.play();
    } else {
      this.ship.setIsMovingForward(false);
      this.Sounds.THRUST.stop();
    }

    //'S' is pressed
    if ((keyIsDown(83) || keyIsDown(40)) && !this.ship.getTeleportActive()) {
      this.ship.teleport();
      this.Sounds.TELEPORT.stop();
      this.Sounds.TELEPORT.play();
    }

    if (keyIsDown(32) && !this.ship.getTeleportActive() && !this.spaceDown) {
      this.spaceDown = true;

      this.spawnBullet();
      this.Sounds.SHOOT.stop();
      this.Sounds.SHOOT.play();
    } else if (!keyIsDown(32) && !this.ship.getTeleportActive()) {
      this.spaceDown = false;
    }
  }

  //Processing mouse click
  processClick() {
    if (mouseIsPressed && !this.gameStarted) {
      this.gameStarted = true;
      this.startGame();

      //If the game started already, go back to main menu
    } else if (mouseIsPressed) {
      this.gameStarted = false;
    }
  }

  spawnBullet() {
    //Bullet Properties:
    const size = 3;
    const speed = 13;
    const position = this.ship.getBulletPosition();
    const rotation = this.ship.getRotation();
    const lifeTime = 1500;
    //White
    const color = "white";

    let bullet = new Bullet(position, size, rotation, speed, lifeTime, color);
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
}
