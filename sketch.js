let ship;

function setup() {
  createCanvas(windowWidth, windowHeight);
  ship = new Ship(width / 2, height / 2, 20, -PI / 2, 0.1);
}

function draw() {
  background(255);
  ship.processInput();
  ship.display();
}
