class GameManager {
  constructor(numAsteroids, numSaucers) {
    this.numAsteroids = numAsteroids;
    this.numSaucers = numSaucers;
    this.score = 0;
  }

  spawnAsteroids() {
    console.log("SPAWNING " + this.numAsteroids + " ASTEROIDS !");
  }
}
