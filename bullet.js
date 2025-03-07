class Bullet extends Actor {
  constructor(position, size, rotation, speed) {
    super(position, size, rotation, speed);
    this.lifeTime = 1000;
    this.lifeTimer = 0;
  }

  update() {
    super.update();
    this.lifeTimer += deltaTime;

    if (this.lifeTimer >= this.lifeTime) {
      this.visible = false;
    }
  }

  display() {
    push();

    translate(this.position);

    fill(0);
    stroke(255);

    if (this.visible) {
      circle(0, 0, this.size);
    }

    pop();
  }
}
