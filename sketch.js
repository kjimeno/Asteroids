let ship;
const shipSize = 20;
const shipRotation = 0.1;
const shipThrustPower = 0.15;
const shipDragForce = 0.98;

let asteroid;

let gameManager;

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

  gameManager = new GameManager(1, 0);
  gameManager.startGame();
}

function draw() {
  background(255, 90);
  ship.processInput();
  ship.update();
  ship.display();

  gameManager.update();
}
