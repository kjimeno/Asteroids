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
  }
}
