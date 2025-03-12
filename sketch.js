let gameManager;
let font;
let music;

function preload() {
  font = loadFont("assets/fonts/pixelated.ttf");
  music = createAudio("assets/sfx/music.mp3");
}

function setup() {
  createCanvas(windowWidth * 0.99, windowHeight * 0.99);
  textAlign(CENTER);
  textFont(font);

  //Loop the music
  music.loop();

  gameManager = new GameManager(4, 0);
  gameManager.startGame();
}

function draw() {
  background(0);

  gameManager.update();
}
