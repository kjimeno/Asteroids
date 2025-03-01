class Bullet extends Actor {
  constructor(position, size, rotation, speed) {
    super(position, size, rotation, speed);
  }

  display() {
    push();

    translate(this.position);

    fill(0);
    stroke(255);
    circle(0, 0, this.size);

    pop();
  }
}
