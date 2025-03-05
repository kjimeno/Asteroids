class GameManager {
  constructor(initNumAsteroids, numSaucers) {
    this.initNumAsteroids = initNumAsteroids;
    this.numSaucers = numSaucers;
    this.score;
    this.numLives;
    this.asteroids = [];
    this.ship;
    this.spaceDown = false;
    this.shipBullets = [];
    this.AsteroidSize = { SMALL: 20, MEDIUM: 50, LARGE: 80 };
    this.AsteroidValue = { SMALL: 100, MEDIUM: 50, LARGE: 20 };
    this.asteroidOffsetSpawn = 15;
  }

  startGame() {
    this.spawnShip();
    for (let i = 0; i < this.initNumAsteroids; i++) {
      let position = createVector(random(windowWidth), random(windowHeight));
      this.spawnAsteroid(position, this.AsteroidSize.LARGE);
    }
    this.score = 0;
    this.numLives = 3;
  }

  update() {
    if (this.ship.getAlive()) {
      this.processInput();
    }

    //Bullets
    for (let i = 0; i < this.shipBullets.length; i++) {
      this.shipBullets[i].update();
      this.shipBullets[i].display();

      //If the ship bullet is destroyed, then remove it from the array
      if (!this.shipBullets[i].getVisibility()) {
        this.shipBullets.splice(i, 1);
      }
    }

    //Ship
    if (this.ship.getAlive()) {
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

    //HUD
    this.displayHUD();
  }

  handleCollision(actor, position) {
    let spawnSmallerAsteroids = false;

    //Check collision if actor is hitting the bullets
    for (let j = 0; j < this.shipBullets.length; j++) {
      let distBetween = actor
        .getPosition()
        .dist(this.shipBullets[j].getPosition());

      let collideDistance =
        actor.getSize() / 2 + this.shipBullets[j].getSize() / 2;

      //If colliding with the ship's bullets
      if (distBetween <= collideDistance) {
        //Destroy ship
        this.shipBullets[j].setVisible(false);
        this.shipBullets.splice(j, 1);

        spawnSmallerAsteroids = true;

        //Destroy this actor
        actor.setVisible(false);
        this.asteroids.splice(position, 1);

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
        console.log(this.score);
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
      console.log(this.numLives);

      //Respawn the ship if they still have a life
      if (this.numLives >= 1) {
        this.spawnShip();
      } else {
        //Destroy the ship
        this.ship.setVisible(false);
        this.ship.die();
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

      this.spawnAsteroid(pos1, size);
      this.spawnAsteroid(pos2, size);
    }
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
    }

    //'S' is pressed
    if ((keyIsDown(83) || keyIsDown(40)) && !this.ship.getTeleportActive()) {
      this.ship.teleport();
    }

    //Space Bar is pressed
    if (keyIsDown(32) && !this.ship.getTeleportActive() && !this.spaceDown) {
      this.spaceDown = true;

      let isFriendly = true;
      this.spawnBullet(isFriendly);
    } else if (!keyIsDown(32) && !this.ship.getTeleportActive()) {
      this.spaceDown = false;
    }
  }

  spawnBullet(friendly) {
    if (friendly) {
      //Bullet Properties:
      const size = 3;
      const speed = 13;
      const position = this.ship.getBulletPosition();
      const rotation = this.ship.getRotation();

      let bullet = new Bullet(position, size, rotation, speed);
      this.shipBullets.push(bullet);
    } else {
      //Enemy Bullet Properties:
    }
  }

  spawnShip() {
    //Ship Properties:
    const size = 20;
    const rotationSpeed = 0.1;
    const thrustPower = 0.15;
    const dragForce = 0.98;
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

  spawnAsteroid(position, size) {
    //Asteroid Properties:
    const rotation = random(TWO_PI);
    const speed = 0.5;
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

  displayHUD() {
    const offsetFromEdge = 50;

    fill(255);
    textSize(20);
    text("SCORE: " + this.score, windowWidth / 2, offsetFromEdge);
    text(
      "NUMBER OF LIVES: " + this.numLives,
      windowWidth / 2,
      windowHeight - offsetFromEdge
    );
  }
}
