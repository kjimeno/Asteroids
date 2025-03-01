class GameManager {
  constructor(initNumAsteroids, numSaucers) {
    this.initNumAsteroids = initNumAsteroids;
    this.numSaucers = numSaucers;
    this.score = 0;
    this.asteroids = [];
    this.ship;
    this.spaceDown = false;
    this.shipBullets = [];
  }

  startGame() {
    this.spawnShip();
    this.spawnAsteroids();
    this.score = 0;
  }

  update() {
    this.processInput();

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
    this.ship.update();
    this.ship.display();

    //Asteroids
    for (let i = 0; i < this.asteroids.length; i++) {
      this.asteroids[i].update();
      this.asteroids[i].display();
    }

    this.handleCollisions();
  }

  handleCollisions() {
    //Check collision for the asteroids

    for (let i = 0; i < this.asteroids.length; i++) {
      for (let j = 0; j < this.shipBullets.length; j++) {
        let distBetween = this.asteroids[i]
          .getPosition()
          .dist(this.shipBullets[j].getPosition());
        let collideDistance =
          this.asteroids[i].getSize() / 2 + this.shipBullets[j].getSize() / 2;

        if (distBetween <= collideDistance) {
          this.shipBullets[j].setVisible(false);
          this.shipBullets.splice(j, 1);

          this.asteroids[i].setVisible(false);
          this.asteroids.splice(i, 1);
        }
      }
    }
  }

  processInput() {
    //'A' is pressed
    if (keyIsDown(65)) {
      this.ship.rotateCounterClockwise();
    }

    //'D' is pressed
    if (keyIsDown(68)) {
      this.ship.rotateClockwise();
    }

    //'W' is pressed
    if (keyIsDown(87)) {
      this.ship.thrustForward();
    }

    //'S' is pressed
    if (keyIsDown(83) && !this.ship.getTeleportActive()) {
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
      const speed = 8;
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

  spawnAsteroids() {
    for (let i = 0; i < this.initNumAsteroids; i++) {
      //Asteroid Properties:
      const position = createVector(random(windowWidth), random(windowHeight));
      const rotation = random(TWO_PI);
      const speed = 0.5;
      const numVertices = 20;
      const shapeStrength = 0.12;
      const largeSize = 80;

      //Create the Asteroid
      let asteroid = new Asteroid(
        position,
        largeSize,
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
}
