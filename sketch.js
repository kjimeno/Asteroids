let gameManager;
let font;

function preload() {
  font = loadFont("assets/fonts/pixelated.ttf");
}

function setup() {
  createCanvas(windowWidth * 0.99, windowHeight * 0.99);
  textAlign(CENTER, CENTER);
  textFont(font);
  rectMode(CENTER);

  gameManager = new GameManager(0);
  gameManager.startGame();
}

function draw() {
  background(0);

  gameManager.update();
}
