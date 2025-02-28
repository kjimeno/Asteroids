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
  }

  rotateCounterClockwise() {
    this.rotation -= this.rotationSpeed;
  }

  rotateClockwise() {
    this.rotation += this.rotationSpeed;
  }

  thrustForward() {
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

  update() {
    //Update the velocity and position based on the drag force
    this.velocity.mult(this.dragForce);
    this.position.add(this.velocity);

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
    push();

    stroke(255);
    fill(0);

    translate(this.position);
    rotate(this.rotation);

    triangle(
      -this.size / 2,
      this.size / 2,
      -this.size / 2,
      -this.size / 2,
      this.size / 2,
      0
    );

    pop();
  }
}
