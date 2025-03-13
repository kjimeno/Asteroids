class Ship extends Actor {
  constructor(position, size, rotation, rotationSpeed, moveSpeed, dragForce) {
    super(position, size, rotation, moveSpeed);
    this.initSize = size;
    this.rotationSpeed = rotationSpeed;
    this.velocity = createVector(0, 0);
    this.thrustPower = moveSpeed;
    this.dragForce = dragForce;
    this.teleportActive = false;
    this.teleportShrinking = false;
    this.teleportAnimSpeed = 0.8;
    this.fireShot = false;
    this.invincibleTimer = 0;
    this.invincibleTime = 14;
    this.invincibleAnimSpeed = 0.005;
    this.invincible = true;
    this.isMovingForward = false;
  }

  respawn() {
    this.invincible = true;
    this.invincibleTimer = 0;
    this.position = createVector(windowWidth / 2, windowHeight / 2);
  }

  rotateCounterClockwise() {
    this.rotation -= this.rotationSpeed;
  }

  rotateClockwise() {
    this.rotation += this.rotationSpeed;
  }

  thrustForward() {
    this.isMovingForward = true;
    this.velocity.add(
      createVector(
        cos(this.rotation) * this.thrustPower,
        sin(this.rotation) * this.thrustPower
      )
    );
  }

  teleport() {
    this.teleportActive = true;
    this.teleportShrinking = true;
  }

  getTeleportActive() {
    return this.teleportActive;
  }

  getVelocity() {
    return this.velocity;
  }

  setIsMovingForward(isTrue) {
    this.isMovingForward = isTrue;
  }

  getBulletPosition() {
    //position (Vector2) + size
    let xBulletLoc = this.position.x + (cos(this.rotation) * this.size) / 2;
    let yBulletLoc = this.position.y + (sin(this.rotation) * this.size) / 2;

    return createVector(xBulletLoc, yBulletLoc);
  }

  getRotation() {
    return this.rotation;
  }

  getInvincible() {
    return this.invincible;
  }

  update() {
    //Update the velocity and position based on the drag force
    this.velocity.mult(this.dragForce);
    this.position.add(this.velocity);

    this.handleTeleportAnim();
    this.wrapWithinScreen();

    //If invincible and the invincible animation  is still active, keep updating the timer
    if (this.invincibleTimer < this.invincibleTime && this.invincible) {
      this.invincibleTimer += deltaTime * this.invincibleAnimSpeed;

      this.visible = int(this.invincibleTimer % 2) == 0 ? true : false;
    } else {
      this.invincible = false;
      this.visible = true;
    }
  }

  handleTeleportAnim() {
    //If the ship is teleporting, currently shrinking, and is not small enough ==> keep shrinking its size
    if (this.teleportActive && this.teleportShrinking && this.size >= 0.1) {
      this.size *= this.teleportAnimSpeed;
    }
    //If the ship is teleporting, currently shrinking, BUT is SMALL enough ==> teleport to a random location
    else if (this.teleportActive && this.teleportShrinking && this.size < 0.1) {
      this.teleportShrinking = false;
      this.position = createVector(random(windowWidth), random(windowHeight));
    }
    //If the ship is teleporting, NO LONGER shrinking, and is NOT as big as its original size ==> keep growing its size
    else if (
      this.teleportActive &&
      !this.teleportShrinking &&
      this.size < this.initSize
    ) {
      this.size *= 2 - this.teleportAnimSpeed;
    }
    //If the ship is teleporting, not shrinking, and is back to the original size ==> set 'teleportActive' to false
    else if (
      this.teleportActive &&
      !this.teleportShrinking &&
      this.size >= this.initSize
    ) {
      this.size = this.initSize;
      this.teleportActive = false;
    }
  }

  display() {
    if (this.visible) {
      push();

      stroke(255);
      fill(0);

      translate(this.position);
      rotate(this.rotation);

      //Draw the ship's base shape (Triangle)
      triangle(
        -this.size / 2,
        this.size / 2,
        -this.size / 2,
        -this.size / 2,
        this.size / 2,
        0
      );

      //Draw the ship's thruster flames
      //
      if (this.isMovingForward) {
        stroke("red");
        triangle(
          (-this.size * 1.5) / 2,
          this.size / 4,
          (-this.size * 1.5) / 2,
          -this.size / 4,
          (-this.size * 2) / 2,
          0
        );
      }

      pop();
    }
  }
}
