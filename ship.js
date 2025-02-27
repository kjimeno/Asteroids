class Ship {
  constructor(position, size, rotation, rotationSpeed, thrustPower, dragForce) {
    this.position = position;
    this.size = size;
    this.initSize = size;
    this.rotation = rotation;
    this.rotationSpeed = rotationSpeed;
    this.velocity = createVector(0, 0);
    this.thrustPower = thrustPower;
    this.dragForce = dragForce;
    this.teleportActive = false;
    this.teleportShrinking = false;
    this.teleportAnimSpeed = 0.8;
  }

  processInput() {
    //'A' is pressed
    if (keyIsDown(65)) {
      this.rotation -= this.rotationSpeed;
    }

    //'D' is pressed
    if (keyIsDown(68)) {
      this.rotation += this.rotationSpeed;
    }

    //'W' is pressed
    if (keyIsDown(87)) {
      this.velocity.add(
        createVector(
          cos(this.rotation) * this.thrustPower,
          sin(this.rotation) * this.thrustPower
        )
      );
    }

    if (keyIsDown(83) && !this.teleportActive) {
      this.teleportActive = true;
      this.teleportShrinking = true;
    }
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

    translate(this.position.x, this.position.y);
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
