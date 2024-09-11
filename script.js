const startButton = document.querySelector(".game-start-button");
const pointsDisplay = document.getElementById("points");
const timeDisplay = document.getElementById("time");

let points = 0;
let timeLeft = 60;
let timer;

startButton.addEventListener("click", startNewGame);

function startNewGame() {
  points = 0;
  timeLeft = 60;
  pointsDisplay.textContent = `Points: ${points}`;
  timeDisplay.textContent = `Time Left: ${timeLeft}`;

  clearInterval(timer); // Clear any previous timer
  timer = setInterval(countDown, 1000); // Start countdown
}

function countDown() {
  if (timeLeft > 0) {
    timeLeft--;
    timeDisplay.textContent = `Time Left: ${timeLeft}`;
  } else {
    clearInterval(timer); // Stop the timer when time reaches 0
    document.getElementById("status").textContent = "Game Over";
  }
}
