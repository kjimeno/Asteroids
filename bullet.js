class Bullet extends Actor {
  update() {}

  display() {
    push();

    translate(this.position);

    fill(0);
    stroke(255);
    circle(0, 0, this.size);

    pop();
  }
}
