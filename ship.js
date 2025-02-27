class Ship {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
  }

  display() {
    push();
    triangle(
      this.x - this.size / 2,
      this.y + this.size / 2,
      this.x - this.size / 2,
      this.y - this.size / 2,
      this.x + this.size / 2,
      this.y
    );
    pop();
    console.log(this.x);
  }
}
