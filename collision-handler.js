class CollisionHandler {
  constructor(gameManager) {
    this.gameManager = gameManager;

    //Asteroid Properties:
    this.AsteroidSize = this.gameManager.AsteroidSize;
    this.AsteroidValue = this.gameManager.AsteroidValue;
    this.asteroidOffsetSpawn = this.gameManager.asteroidOffsetSpawn;
    this.AsteroidSpeed = this.gameManager.AsteroidSpeed;

    //Saucer Properties:
    this.SaucerSize = this.gameManager.SaucerSize;
  }

  update() {
    //Check collision for the asteroids
    for (let i = 0; i < this.gameManager.asteroids.length; i++) {
      //With the ship bullets
      for (let j = 0; j < this.gameManager.shipBullets.length; j++) {
        this.handleCollision(
          this.gameManager.shipBullets[j],
          this.gameManager.asteroids[i]
        );
      }

      //With the ship
      this.handleCollision(
        this.gameManager.ship,
        this.gameManager.asteroids[i]
      );

      //With the saucer bullets
      for (let j = 0; j < this.gameManager.saucerBullets.length; j++) {
        this.handleCollision(
          this.gameManager.saucerBullets[j],
          this.gameManager.asteroids[i]
        );
      }

      //With the saucers
      for (let j = 0; j < this.gameManager.saucers.length; j++) {
        this.handleCollision(
          this.gameManager.saucers[j],
          this.gameManager.asteroids[i]
        );
      }
    }
  }

  handleCollision(thisActor, otherActor) {
    //If any of the actors are already destroyed, don't check for collisions
    if (!thisActor || !otherActor) {
      return;
    }

    //Calculate the distance between the two actors
    let dist = thisActor.getPosition().dist(otherActor.getPosition());
    if (dist <= thisActor.getSize() / 2 + otherActor.getSize() / 2) {
      //HANDLING OTHER ACTOR -------------------------------------------------------------------------------------------------------------------------------
      //If other actor is an asteroid (BUT this actor is a ship bullet)

      let otherIsAsteroid = this.gameManager.asteroids.includes(otherActor);
      let thisIsBullet =
        this.gameManager.shipBullets.includes(thisActor) ||
        this.gameManager.saucerBullets.includes(thisActor);
      let thisIsShip =
        this.gameManager.ship === thisActor && !thisActor.getInvincible();
      let thisIsSaucer = this.gameManager.saucers.includes(thisActor);

      //Check if this actor is a vulnerable ship or bullet, and if the other actor is an asteroid
      if (otherIsAsteroid && (thisIsBullet || thisIsShip || thisIsSaucer)) {
        //Destroy the asteroid
        this.destroyItemFromArray(otherActor, this.gameManager.asteroids);

        //If the last asteroid just got destroyed, move to the next level
        if (
          otherActor.getSize() === this.AsteroidSize.SMALL &&
          this.gameManager.asteroids.length <= 0
        ) {
          this.gameManager.level++;
          for (let i = 0; i < this.gameManager.level; i++) {
            let position = createVector(
              random(windowWidth),
              random(windowHeight)
            );
            this.gameManager.spawnAsteroid(
              position,
              this.AsteroidSize.LARGE,
              this.AsteroidSpeed.LARGE
            );
          }
        }
        //If the asteroid that just got destroyed is not small,
        //Spawn 2 smaller asteroids if not the smallest size
        else if (otherActor.getSize() !== this.AsteroidSize.SMALL) {
          //Randomized position for the 2 smaller asteroids
          let pos1 = createVector(
            -this.asteroidOffsetSpawn + 2 * random(this.asteroidOffsetSpawn),
            -this.asteroidOffsetSpawn + 2 * random(this.asteroidOffsetSpawn)
          ).add(otherActor.getPosition());
          let pos2 = createVector(
            -this.asteroidOffsetSpawn + 2 * random(this.asteroidOffsetSpawn),
            -this.asteroidOffsetSpawn + 2 * random(this.asteroidOffsetSpawn)
          ).add(otherActor.getPosition());

          //Determine the size of the smaller asteroids
          let size =
            otherActor.getSize() == this.AsteroidSize.LARGE
              ? this.AsteroidSize.MEDIUM
              : this.AsteroidSize.SMALL;

          //Determine the speed of the smaller asteroids
          let speed =
            otherActor.getSize() == this.AsteroidSize.LARGE
              ? this.AsteroidSpeed.MEDIUM
              : this.AsteroidSpeed.SMALL;

          //Spawn the smaller asteroids
          this.gameManager.spawnAsteroid(pos1, size, speed);
          this.gameManager.spawnAsteroid(pos2, size, speed);
        }

        //Add to the total score if the asteroid collides with a ship bullet
        if (this.gameManager.shipBullets.includes(thisActor)) {
          switch (otherActor.getSize()) {
            case this.AsteroidSize.LARGE:
              this.gameManager.score += this.AsteroidValue.LARGE;
              break;
            case this.AsteroidSize.MEDIUM:
              this.gameManager.score += this.AsteroidValue.MEDIUM;
              break;
            case this.AsteroidSize.SMALL:
              this.gameManager.score += this.AsteroidValue.SMALL;
              break;
          }

          //Play explosion sound
          this.gameManager.Sounds.EXPLODE.stop();
          this.gameManager.Sounds.EXPLODE.play();
        }
      }

      //HANDLING THIS ACTOR -------------------------------------------------------------------------------------------------------------------------------

      //If this actor is a ship bullet
      if (this.gameManager.shipBullets.includes(thisActor)) {
        //Destroy the ship bullet
        this.destroyItemFromArray(thisActor, this.gameManager.shipBullets);
      }

      //If this actor is a saucer bullet
      if (this.gameManager.saucerBullets.includes(thisActor)) {
        //Destroy the saucer bullet
        this.destroyItemFromArray(thisActor, this.gameManager.saucerBullets);
      }

      //If this actor is a saucer
      if (this.gameManager.saucers.includes(thisActor)) {
        //Destroy the saucer
        this.destroyItemFromArray(thisActor, this.gameManager.saucers);
      }

      //If this actor is the ship
      if (thisActor === this.gameManager.ship) {
        //Get data for checking collision
        let distBetween = otherActor
          .getPosition()
          .dist(thisActor.getPosition());
        let collideDist = thisActor.getSize() / 2 + otherActor.getSize() / 2;

        //If the ship is actually colliding with the other actor
        if (distBetween <= collideDist && !thisActor.getInvincible()) {
          //Reduce the number of lives
          this.gameManager.numLives--;

          //Respawn the ship if they still have a life
          if (this.gameManager.numLives >= 1) {
            thisActor.respawn();
            this.gameManager.Sounds.DEATH.stop();
            this.gameManager.Sounds.DEATH.play();
          } else {
            this.gameManager.gameIsOver = true;
            this.gameManager.music.stop();
            this.gameManager.Sounds.GAMEOVER.play();
          }
        }
      }

      //Gain an extra life for every 10,000 points scored
      if (
        this.gameManager.score - this.gameManager.lastScoreAddLife >=
        this.gameManager.ADD_LIFE_MILESTONE
      ) {
        this.gameManager.lastScoreAddLife +=
          this.gameManager.ADD_LIFE_MILESTONE;
        this.gameManager.numLives++;
      }
    }

    //Spawn a big saucer for every 800 points scored
    //Spawn a small saucer for every 2500 points scored
    if (
      this.gameManager.score - this.gameManager.lastScoreSmallSaucer >=
      this.gameManager.SPAWN_SMALL_SAUCER_MILESTONE
    ) {
      this.gameManager.lastScoreSmallSaucer +=
        this.gameManager.SPAWN_SMALL_SAUCER_MILESTONE;
      this.gameManager.spawnSaucer(this.SaucerSize.SMALL);
    } else if (
      this.gameManager.score - this.gameManager.lastScoreBigSaucer >=
      this.gameManager.SPAWN_BIG_SAUCER_MILESTONE
    ) {
      this.gameManager.lastScoreBigSaucer +=
        this.gameManager.SPAWN_BIG_SAUCER_MILESTONE;
      this.gameManager.spawnSaucer(this.SaucerSize.LARGE);
    }
  }

  destroyItemFromArray(item, array) {
    let index = array.indexOf(item);
    array.splice(index, 1);
  }
}
