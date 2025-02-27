class Ship {
  constructor(position, size, rotation, rotationSpeed, thrustPower, dragForce) {
    this.position = position;
    this.size = size;
    this.rotation = rotation;
    this.rotationSpeed = rotationSpeed;
    this.velocity = createVector(0, 0);
    this.thrustPower = thrustPower;
    this.dragForce = dragForce;
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
  }

  update() {
    console.log(this.velocity);
    this.velocity.mult(this.dragForce);

    this.position.add(this.velocity);
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
