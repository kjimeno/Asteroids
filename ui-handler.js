class UIHandler {
  //Displays the player's score and the number of lives left
  displayHUD(score, level, numLives) {
    const offsetFromEdge = 50;

    fill(255);
    textSize(20);

    //Score Text (Displayed at the top-left)
    text("SCORE: " + score, windowWidth * 0.1, offsetFromEdge);

    //Level Text (Displayed at the top-right)
    text("LEVEL: " + level, windowWidth * 0.9, offsetFromEdge);

    //Number of Lives Text
    text(
      "NUMBER OF LIVES: " + numLives,
      windowWidth / 2,
      windowHeight - offsetFromEdge
    );
  }

  //Display the title screen
  displayTitleScreen(gameManager) {
    //Title text block
    fill(255);
    textSize(60);
    text("ASTEROIDS", windowWidth / 2, windowHeight * 0.1);

    //Title screen start button
    //Properties
    const buttonWidth = 300;
    const buttonHeight = 70;
    const buttonPosY = windowHeight * 0.85;
    const buttonText = "START";
    const buttonTextSize = 30;

    this.drawButton(
      buttonWidth,
      buttonHeight,
      buttonPosY,
      buttonText,
      buttonTextSize,
      gameManager
    );
  }

  drawButton(
    buttonWidth,
    buttonHeight,
    btnPosY,
    textContent,
    textSizing,
    gameManager
  ) {
    let withinX =
      mouseX >= windowWidth / 2 - buttonWidth / 2 &&
      mouseX <= windowWidth / 2 + buttonWidth / 2;

    let withinY =
      mouseY >= btnPosY - buttonHeight / 2 &&
      mouseY <= btnPosY + buttonHeight / 2;

    let btnHoverColor = 0;

    if (withinX && withinY) {
      cursor(HAND);
      //Grey
      btnHoverColor = 50;
      gameManager.processClick();
    } else {
      cursor(ARROW);
    }

    push();

    fill(btnHoverColor);
    stroke(255);
    strokeWeight(3);

    //Draw the button
    rect(windowWidth / 2, btnPosY, buttonWidth, buttonHeight);

    pop();

    //Draw the button text block
    textSize(textSizing);
    text(textContent, windowWidth / 2, btnPosY);
  }

  //Displays the game over screen and the score
  displayGameOverScreen(score, thrustSound, gameManager) {
    let scoreTextOffset = 50;
    let replayBtnPosY = windowHeight * 0.6;
    let replayBtnWidth = 300;
    let replayBtnHeight = 70;
    let replayText = "MAIN MENU";
    let replayTextSize = 30;

    //Game over text block
    fill(255);
    textSize(60);
    text("GAME OVER!", windowWidth / 2, windowHeight * 0.4);

    //Score text block
    textSize(30);
    text(
      "YOUR TOTAL SCORE: " + score,
      windowWidth / 2,
      windowHeight * 0.4 + scoreTextOffset
    );

    //Stop the thrusting sound
    thrustSound.stop();

    //Replay button
    this.drawButton(
      replayBtnWidth,
      replayBtnHeight,
      replayBtnPosY,
      replayText,
      replayTextSize,
      gameManager
    );
  }
}
