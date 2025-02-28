class GameManager {
  constructor(numAsteroids, numSaucers) {
    this.numAsteroids = numAsteroids;
    this.numSaucers = numSaucers;
    this.score = 0;
    this.asteroids = [];
    this.ship;
    this.spaceDown = false;
  }

  startGame() {
    this.spawnShip();
    this.spawnAsteroids();
    this.score = 0;
  }

  update() {
    this.processInput();
    this.ship.update();
    this.ship.display();

    for (let i = 0; i < this.numAsteroids; i++) {
      this.asteroids[i].update();
      this.asteroids[i].display();
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
      console.log("FIRE!");
    } else if (!keyIsDown(32) && !this.ship.getTeleportActive()) {
      this.spaceDown = false;
    }
  }

  spawnShip() {
    //Ship Properties:
    const size = 20;
    const rotation = 0.1;
    const thrustPower = 0.15;
    const dragForce = 0.98;
    const position = createVector(width / 2, height / 2);
    const rotoation = -PI / 2;

    //Create the Spaceship
    this.ship = new Ship(
      position,
      size,
      rotoation,
      rotation,
      thrustPower,
      dragForce
    );
  }

  spawnAsteroids() {
    for (let i = 0; i < this.numAsteroids; i++) {
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
