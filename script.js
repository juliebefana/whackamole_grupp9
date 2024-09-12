// Select elements
const nameEntry = document.getElementById('name-entry');
const hideboard = document.getElementById('hide-board');
const playerNameInput = document.getElementById('player-name-input');
const submitNameButton = document.getElementById('submit-name-button');
const gameBoard = document.getElementById('game-board');
const timerElement = document.getElementById('timer');
const startButton = document.getElementById('start-button');
const playerNameDisplay = document.getElementById('player-name-display');

// Game variables
let timeLeft = 30;
let timer;
let maxMoles = 3;
let activeMoles = 0;
let gameActive = false;
let moleInterval;
let playerName = 'Unnamed Player'; // Default name

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

// Handle cell click
function handleCellClick(e) {
  const cell = e.target;
  if (cell.classList.contains('mole')) {
    // If the mole is clicked, remove it
    cell.classList.remove('mole');
    activeMoles--;
  }
}

// Start game logic
function startGame() {
  gameActive = true;
  timeLeft = 60;
  activeMoles = 0;
  timerElement.textContent = `Time Left: ${timeLeft}`;


  // Start the countdown timer
  timer = setInterval(() => {
    timeLeft--;
    timerElement.textContent = `Time Left: ${timeLeft}`;
    if (timeLeft <= 0) {
      clearInterval(timer);
      clearInterval(moleInterval);
      gameActive = false;
      alert('Game Over!');
    }
  }, 1000);

  // Start the mole appearance logic
  moleInterval = setInterval(() => {
    if (gameActive && activeMoles < maxMoles) {
      spawnMole();
    }
  }, getRandomInterval());
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
    
    // Mole disappears after a random time
    setTimeout(() => {
      if (moleCell.classList.contains('mole')) {
        moleCell.classList.remove('mole');
        activeMoles--;
      }
    }, getRandomInterval());
  }
}

// Random time between 500ms and 2000ms for mole appearance/disappearance
function getRandomInterval() {
  return Math.floor(Math.random() * 1500) + 500;
}

// Event listener for start button
startButton.addEventListener('click', () => {
  if (!gameActive) {
    startGame();
  }
});

// Initialize the game board on page load
createBoard();
