let ship;

function setup() {
  createCanvas(windowWidth, windowHeight);
  ship = new Ship(width / 2, height / 2, 20);
}

function draw() {
  ship.display();
}
