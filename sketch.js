let gameManager;

function setup() {
  createCanvas(windowWidth * 0.99, windowHeight * 0.99);

  gameManager = new GameManager(4, 0);
  gameManager.startGame();
}

function draw() {
  background(0);

  gameManager.update();
}
