class Bullet extends Actor {
  constructor(position, size, rotation, speed, lifeTime, color) {
    super(position, size, rotation, speed);
    this.lifeTime = lifeTime;
    this.lifeTimer = 0;
    this.color = color;
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
    stroke(this.color);

    if (this.visible) {
      circle(0, 0, this.size);
    }

    pop();
  }
}
