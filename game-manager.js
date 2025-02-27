class GameManager {
  constructor(numAsteroids, numSaucers) {
    this.numAsteroids = numAsteroids;
    this.numSaucers = numSaucers;
    this.score = 0;
    this.asteroids = [];
  }

  startGame() {
    this.spawnAsteroids();
    this.score = 0;
  }

  update() {
    for (let i = 0; i < this.numAsteroids; i++) {
      this.asteroids[i].update();
      this.asteroids[i].display();
    }
  }

  spawnAsteroids() {
    for (let i = 0; i < this.numAsteroids; i++) {
      let position = createVector(random(windowWidth), random(windowHeight));
      let rotation = random(TWO_PI);
      let speed = 0.5;
      let numVertices = 20;
      let shapeStrength = 0.12;
      let largeSize = 80;

      asteroid = new Asteroid(
        position,
        largeSize,
        rotation,
        speed,
        numVertices,
        shapeStrength
      );

      asteroid.initialize();

      this.asteroids.push(asteroid);
    }
  }

  spawnShip() {}
}
