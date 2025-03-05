let gameManager;

function setup() {
  createCanvas(windowWidth, windowHeight);

  gameManager = new GameManager(4, 0);
  gameManager.startGame();
}

function draw() {
  background(0);

  gameManager.update();
}
