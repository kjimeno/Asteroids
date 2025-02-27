class GameManager {
  constructor(numAsteroids, numSaucers) {
    this.numAsteroids = numAsteroids;
    this.numSaucers = numSaucers;
    this.score = 0;

    this.AsteroidProperties = {
      POSITION: createVector(windowWidth / 4, windowHeight / 4),
      ROTATION: random(TWO_PI),
      SPEED: 0.5,
      NUM_VERTICES: 20,
      SHAPE_STRENGTH: 0.12,
      LARGE_SIZE: 80,
    };
  }

  startGame() {
    this.spawnAsteroids();
    this.score = 0;
  }

  update() {
    asteroid.update();
    asteroid.display();
  }

  spawnAsteroids() {
    asteroid = new Asteroid(
      this.AsteroidProperties.POSITION,
      this.AsteroidProperties.LARGE_SIZE,
      this.AsteroidProperties.ROTATION,
      this.AsteroidProperties.SPEED,
      this.AsteroidProperties.NUM_VERTICES,
      this.AsteroidProperties.SHAPE_STRENGTH
    );
    asteroid.initialize();
  }

  spawnShip() {}
}
