let ship;
const shipSize = 20;
const shipRotation = 0.1;
const shipThrustPower = 0.15;
const shipDragForce = 0.98;

let asteroid;

function setup() {
  createCanvas(windowWidth, windowHeight);

  let initShipPos = createVector(width / 2, height / 2);
  let initShipRot = -PI / 2;

  ship = new Ship(
    initShipPos,
    shipSize,
    initShipRot,
    shipRotation,
    shipThrustPower,
    shipDragForce
  );

  let asteroidPos = createVector(windowWidth / 4, windowHeight / 4);
  let asteroidLargeSize = 80;
  let asteroidNumVertices = 20;
  let asteroidShapeStrength = 0.12;
  asteroid = new Asteroid(
    asteroidPos,
    asteroidLargeSize,
    asteroidNumVertices,
    asteroidShapeStrength
  );
  asteroid.initialize();
}

function draw() {
  background(255, 90);
  ship.processInput();
  ship.update();
  ship.display();

  asteroid.update();
  asteroid.display();
}
