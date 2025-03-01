class Actor {
  constructor(position, size, rotation, moveSpeed) {
    this.position = position;
    this.size = size;
    this.rotation = rotation;
    this.moveSpeed = moveSpeed;
  }

  update() {
    //calculate the distance travelled
    let dist = createVector(
      cos(this.rotation) * this.moveSpeed,
      sin(this.rotation) * this.moveSpeed
    );
    this.position.add(dist);

    this.wrapWithinScreen();
  }

  //The actor's movement wraps around the screen edges while maintaining momentum
  wrapWithinScreen() {
    //Left screen edge
    if (this.position.x + this.size / 2 < 0) {
      this.position.x = windowWidth + this.size / 2;
    }
    //Right screen edge
    else if (this.position.x - this.size / 2 > windowWidth) {
      this.position.x = -this.size / 2;
    }
    //Top screen edge
    else if (this.position.y + this.size / 2 < 0) {
      this.position.y = windowHeight + this.size / 2;
    }
    //Down screen edge
    else if (this.position.y - this.size / 2 > windowHeight) {
      this.position.y = -this.size / 2;
    }
  }
}
