class Saucer extends Actor {
  constructor(position, size, moveSpeed, target) {
    super(position, size, 0, moveSpeed);
    this.size = size;
    this.position = position;
    this.initialPos = createVector(position.x, position.y);
    this.moveSpeedX = moveSpeed;
    this.moveSpeedY = 0.03;
    this.vertices = [];
    this.NUM_VERTICES = 6;
    this.maxYOffset = 60;
    this.target = target;
    this.readyToShoot = false;
    this.shootFireRate = 1000;
    this.shootTimer = 0;
  }

  setupShape() {
    print("SETTING UP");

    //Lower Shell
    this.vertices.push(createVector(-this.size, this.size / 4));
    this.vertices.push(createVector(this.size, this.size / 4));
    this.vertices.push(createVector(this.size / 2, -this.size / 4));
    this.vertices.push(createVector(-this.size / 2, -this.size / 4));

    //Upper Shell
    this.vertices.push(createVector(this.size / 2, -this.size / 4));
    this.vertices.push(createVector(-this.size / 2, -this.size / 4));
    this.vertices.push(createVector(-this.size / 3, -this.size / 2));
    this.vertices.push(createVector(this.size / 3, -this.size / 2));
  }

  update() {
    this.position.x += this.moveSpeedX;

    let deltaY = sin(frameCount * this.moveSpeedY) * this.maxYOffset;
    this.position.y = this.initialPos.y + deltaY;

    //Update the fire rate timer
    this.shootTimer += deltaTime;
    if (this.shootTimer >= 1000) {
      this.readyToShoot = true;
      this.shootTimer = 0;
    }

    this.wrapWithinScreen();
  }

  display() {
    push();

    translate(this.position);

    fill(0);
    stroke(255);

    circle(0, 0, this.size);

    //Lower Shell
    beginShape();
    for (let i = 0; i < 4; i++) {
      vertex(this.vertices[i].x, this.vertices[i].y);
    }
    endShape(CLOSE);

    //Upper Shell
    beginShape();
    for (let i = 4; i < 8; i++) {
      vertex(this.vertices[i].x, this.vertices[i].y);
    }
    endShape(CLOSE);
    pop();
  }

  getBulletType() {
    //Bullet Properties:
    const size = 3;
    const speed = 7;
    const position = createVector(this.position.x, this.position.y);
    const lifeTime = 3000;

    //Rotation as a vector
    let rotation = createVector(
      this.target.getPosition().x,
      this.target.getPosition().y
    ).sub(this.position);

    //Rotation as an angle
    rotation = atan2(rotation.y, rotation.x);

    return new Bullet(position, size, rotation, speed, lifeTime);
  }

  getReadyToShoot() {
    return this.readyToShoot;
  }

  shoot() {
    this.readyToShoot = false;
  }
}
