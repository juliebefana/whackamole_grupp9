// Select elements
const nameEntry = document.getElementById('name-entry');
const hideboard = document.getElementById('hide-board');
const playerNameInput = document.getElementById('player-name-input');
const submitNameButton = document.getElementById('submit-name-button');
const gameBoard = document.getElementById('game-board');
const timerElement = document.getElementById('timer');
const startButton = document.getElementById('start-button');
const playerNameDisplay = document.getElementById('player-name-display');
const pointsDisplay = document.getElementById("points");

// Game variables
let timeLeft = 60;  // Updated to 60 seconds
let timer;
let maxMoles = 3;
let activeMoles = 0;
let gameActive = false;
let moleInterval;
let playerName = 'Unnamed Player'; // Default name
let points = 0;

// Event listener for player-name submission
submitNameButton.addEventListener('click', () => {
  const enteredName = playerNameInput.value.trim();
  if (enteredName) {
    playerName = enteredName;
    playerNameDisplay.textContent = `Player: ${playerName}`;
    nameEntry.style.display = 'none';
    hideboard.style.display = 'block';
    createBoard();
  } else {
    alert('Please enter a valid name.');
  }
});

// Create the game board (5x5)
function createBoard() {

  // Clear any existing cells
  gameBoard.innerHTML = '';
  
  for (let i = 0; i < 25; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.id = i;  // Store the cell id for reference
    cell.addEventListener('click', handleCellClick);
    gameBoard.appendChild(cell);
  }
}

// Handle cell click (Whacking the mole)
function handleCellClick(e) {
  const cell = e.target;
  if (cell.classList.contains('mole')) {
    // If the mole is clicked, remove it
    cell.classList.remove('mole');
    activeMoles--;
    points++;
    pointsDisplay.textContent = `Points: ${points}`;
    console.log("Points: " + points);
    console.log("Mole whacked! Active moles:", activeMoles);
  }
}

// Start game logic
function startGame() {
  console.log("Game started!");
  gameActive = true;
  timeLeft = 60;  // Reset the timer to 60 seconds
  activeMoles = 0;
  points = 0;
  pointsDisplay.textContent = `Points: ${points}`;
  timerElement.textContent = `Time Left: ${timeLeft}`;

  // Disable the start button while the game is active
  startButton.disabled = true;

  // Start the countdown timer
  timer = setInterval(() => {
    timeLeft--;
    timerElement.textContent = `Time Left: ${timeLeft}`;
    console.log("Time left:", timeLeft);
    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);

  // Start the mole appearance logic
  moleInterval = setInterval(() => {
    if (gameActive && activeMoles < maxMoles) {
      spawnMole();
    }
  }, getRandomInterval());
}

// Function to end the game
function endGame() {
  clearInterval(timer);
  clearInterval(moleInterval);
  gameActive = false;
  startButton.disabled = false;  // Re-enable the start button
  alert('Game Over!');
}

// Function to spawn a mole in a random cell
function spawnMole() {
  const cells = document.querySelectorAll('.cell');
  const availableCells = [...cells].filter(cell => !cell.classList.contains('mole'));
  
  if (availableCells.length > 0) {
    const randomIndex = Math.floor(Math.random() * availableCells.length);
    const moleCell = availableCells[randomIndex];
    moleCell.classList.add('mole');
    activeMoles++;
    console.log("Mole appeared in cell:", moleCell.dataset.id, "Active moles:", activeMoles);
    
    // Mole disappears after a random time (max 4 seconds) if not clicked
    setTimeout(() => {
      if (moleCell.classList.contains('mole')) {
        moleCell.classList.remove('mole');
        activeMoles--;
        console.log("Mole disappeared from cell:", moleCell.dataset.id, "Active moles:", activeMoles);
      }
    }, getRandomDisappearInterval());  // Mole disappears after random time
  }
}

// Random interval between 500ms and 2000ms for mole appearance
function getRandomInterval() {
  return Math.floor(Math.random() * 1500) + 500;
}

// Random interval for mole disappearing (max 4000ms or 4 seconds)
function getRandomDisappearInterval() {
  return Math.floor(Math.random() * 3000) + 1000;  // Between 1000ms (1s) and 4000ms (4s)
}

// Event listener for start button
startButton.addEventListener('click', () => {
  if (!gameActive) {
    startGame();
  }
});

// Initialize the game board on page load
createBoard();

