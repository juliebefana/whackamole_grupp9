// Select elements
const nameEntry = document.getElementById("name-entry");
const hideboard = document.getElementById("hide-board");
const playerNameInput = document.getElementById("player-name-input");
const submitNameButton = document.getElementById("submit-name-button");
const gameBoard = document.getElementById("game-board");
const timerElement = document.getElementById("timer");
const startButton = document.getElementById("start-button");
const playerNameDisplay = document.getElementById("player-name-display");
const pointsDisplay = document.getElementById("points");
{
  /* <div id="data-container"></div>
const dataContainer = document.getElementById("data-container"); */
}

// Game variables
let timeLeft = 30; // Updated to 60 seconds
let timer;
let maxMoles = 3;
let activeMoles = 0;
let gameActive = false;
let moleInterval;
let playerName = "Unnamed Player"; // Default name
let points = 0;
let speed = 10.0;
let moleAppearTimes = {}; // To store the appearance time of each mole

// Event listener for player-name submission
submitNameButton.addEventListener("click", () => {
  const enteredName = playerNameInput.value.trim();
  if (enteredName) {
    playerName = enteredName;
    playerNameDisplay.textContent = `Player: ${playerName}`;
    nameEntry.style.display = "none";
    hideboard.style.display = "block";
    createBoard();
  } else {
    alert("Please enter a valid name.");
  }
});

// Create the game board (5x5)
function createBoard() {
  // Clear any existing cells
  gameBoard.innerHTML = "";

  for (let i = 0; i < 25; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.id = i; // Store the cell id for reference
    cell.addEventListener("click", handleCellClick);
    gameBoard.appendChild(cell);
  }
}

// Handle cell click (Whacking the mole)
function handleCellClick(e) {
  const cell = e.target;
  const moleId = cell.dataset.id; // Get the mole's ID
  if (cell.classList.contains("mole")) {
    // If the mole is clicked, remove it
    cell.classList.remove("mole");
    activeMoles--;
    points++;
    pointsDisplay.textContent = `Points: ${points}`;

    // Calculate the time the mole was on the screen
    const moleAppearedAt = moleAppearTimes[moleId];
    const timeNow = Date.now();
    const timeOnScreen = (timeNow - moleAppearedAt) / 1000; // Convert to seconds
    if (timeOnScreen < speed) {
      speed = timeOnScreen;
    }
    console.log(
      `Mole whacked! Time on screen: ${timeOnScreen.toFixed(2)} seconds`
    );
    // Clean up the appearance time for the mole
    delete moleAppearTimes[moleId];
  }
}

// Start game logic
function startGame() {
  console.log("Game started!");
  gameActive = true;
  timeLeft = 15; // Reset the timer to 60 seconds
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
  startButton.disabled = false; // Re-enable the start button

  postData(playerName, points, speed).then(() => {
    showPopup();
    speed = 10; // Show the popup after posting data
  });
  console.log(postData);
}

// Function to spawn a mole in a random cell
function spawnMole() {
  const cells = document.querySelectorAll(".cell");
  const availableCells = [...cells].filter(
    (cell) => !cell.classList.contains("mole")
  );

  if (availableCells.length > 0) {
    const randomIndex = Math.floor(Math.random() * availableCells.length);
    const moleCell = availableCells[randomIndex];
    moleCell.classList.add("mole");
    activeMoles++;
    console.log(
      "Mole appeared in cell:",
      moleCell.dataset.id,
      "Active moles:",
      activeMoles
    );

    moleAppearTimes[moleCell.dataset.id] = Date.now();

    // Mole disappears after a random time (max 4 seconds) if not clicked
    setTimeout(() => {
      if (moleCell.classList.contains("mole")) {
        moleCell.classList.remove("mole");
        activeMoles--;
        console.log(
          "Mole disappeared from cell:",
          moleCell.dataset.id,
          "Active moles:",
          activeMoles
        );
        delete moleAppearTimes[moleCell.dataset.id];
      }
    }, getRandomDisappearInterval()); // Mole disappears after random time
  }
}

// Random interval between 500ms and 2000ms for mole appearance
function getRandomInterval() {
  return Math.floor(Math.random() * 1500) + 500;
}

// Random interval for mole disappearing (max 4000ms or 4 seconds)
function getRandomDisappearInterval() {
  return Math.floor(Math.random() * 3000) + 1000; // Between 1000ms (1s) and 4000ms (4s)
}

// Event listener for start button
startButton.addEventListener("click", () => {
  if (!gameActive) {
    startGame();
  }
});

//Show and fetch result
async function showPopup() {
  const popup = document.getElementById("popup");
  const pointsResultsContainer = document.getElementById(
    "points-results-container"
  );
  const speedResultsContainer = document.getElementById(
    "speed-results-container"
  );

  try {
    const response = await fetch("http://localhost:3000/getData");
    const data = await response.json();

    // Display data in the popup
    pointsResultsContainer.innerHTML = data
      .map((item) => `<p>${item.name}: ${item.score} poäng</p>`)
      .join("");

    speedResultsContainer.innerHTML = data
      .map((item) => `<p>${item.name}: ${item.speed} </p>`)
      .join("");
  } catch (error) {
    console.error("Fel vid hämtning av data:", error);
    pointsResultsContainer.innerHTML =
      "<p>Det gick inte att hämta ledartavlan.</p>";

    speedResultsContainer.innerHTML =
      "<p>Det gick inte att hämta hastighetsresultaten.</p>";
  }

  popup.style.display = "block"; // Show the popup

  // Set timeout to close the popup after 10 seconds
  setTimeout(() => {
    popup.style.display = "none";
  }, 10000); // 10000 milliseconds = 10 seconds
}

// Close popup when the user clicks on <span> (x)
document.getElementById("close-popup").addEventListener("click", () => {
  document.getElementById("popup").style.display = "none";
});

//posta poäng till DB
async function postData(playerName, points, speed) {
  if (!playerName || typeof playerName !== "string") {
    console.error("Fel: Spelarnamnet är ogiltigt.");
    return;
  }

  const data = { name: playerName, score: points, speed: speed };

  try {
    const response = await fetch("http://localhost:3000/postData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    console.log("Data skickad till servern:", result);
  } catch (error) {
    console.error("Fel vid skickande av data:", error);
  }
}

// Initialize the game board on page load
fetchData();
createBoard();
