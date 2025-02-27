class Ship {
  constructor(x, y, size, rotation, rotationSpeed) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.rotation = rotation;
    this.rotationSpeed = rotationSpeed;
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
  }

  display() {
    push();

    translate(this.x, this.y);
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
