class Asteroid {
  constructor(position, size, rotation, speed, numVertices, shapeStrength) {
    this.position = position;
    this.radius = size / 2;
    this.rotation = rotation;
    this.speed = speed;
    this.numVertices = numVertices;
    this.vertices = [];
    this.radiusMaxOffset = size * shapeStrength;
  }

  initialize() {
    //Set up the shape (vertices)
    for (let i = 0; i < this.numVertices; i++) {
      let angle = (i * TWO_PI) / this.numVertices;

      //Random distance from the position
      let radius = random(
        this.radius - this.radiusMaxOffset,
        this.radius + this.radiusMaxOffset
      );

      //Using this random distance from the position, create a vector and add it to the array of vertices
      let xDist = radius * cos(angle);
      let yDist = radius * sin(angle);
      this.vertices.push(createVector(xDist, yDist));
    }
  }

  update() {
    let dist = createVector(
      cos(this.rotation) * this.speed,
      sin(this.rotation) * this.speed
    );
    this.position.add(dist);
  }

  display() {
    push();
    translate(this.position);

    //Draw out the polygon based on the positions of the vertices from the vertix array
    beginShape();
    for (let i = 0; i < this.vertices.length; i++) {
      vertex(this.vertices[i].x, this.vertices[i].y);
    }
    endShape(CLOSE);

    pop();
  }
}
