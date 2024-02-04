document.addEventListener("DOMContentLoaded", function () {
  const menuButton = document.getElementById("Menu");
  const backButton = document.getElementById("Back");
  const modal = document.getElementById("myModal");
  const confirmYes = document.getElementById("confirmYes");
  const confirmNo = document.getElementById("confirmNo");
  const resetButton = document.getElementById("resetButton");
  resetButton.addEventListener("click", resetGame);

  function resetGame() {
    board = Array(36).fill("");
    gameover = false;
    turn = "X";

    const cells = document.getElementsByTagName("td");
    for (const cell of cells) {
      cell.innerHTML = board[parseInt(cell.id.match(/\d+/g).pop())];
      cell.classList.remove("highlight");
    }

    setTimeout(() => {
      if (!gameover) cells.forEach((cell) => (cell.innerHTML = board[parseInt(cell.id.match(/\d+/g).pop())]));
    }, 1000);
  }

  backButton.addEventListener("click", function() {
      const back = "Game-AI-Difficulty.html";
      window.location.href = back;
  });
  menuButton.addEventListener("click", function () {
      modal.style.display = "block";

      confirmYes.onclick = function () {
          const menuURL = "index.html";
          window.location.href = menuURL;
          modal.style.display = "none";
      };

      confirmNo.onclick = function () {
          modal.style.display = "none";
      };
  });
});

let board = Array(36).fill("");
let turn = "X";
let gameover = false;
let player1Score = 0;
let computerScore = 0;

function placemarker(cell) {
  if (turn === "O" || gameover) return;

  const index = parseInt(cell.id.match(/\d+/g).pop());
  if (cell.innerHTML === "") {
    cell.innerHTML = turn;
    board[index] = turn;
    checkWin();
    if (!gameover) {
      turn = "O";
      computerTurn();
    }
  }
}

function computerTurn() {
  setTimeout(() => {
    if (!gameover) {
      const emptyCells = board.reduce((acc, _, i) => (board[i] === "" ? acc.concat(i) : acc), []);

      if (emptyCells.length > 0) {
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        const computerMove = emptyCells[randomIndex];
        board[computerMove] = turn;
        document.getElementById(`cell${computerMove}`).innerHTML = turn;
        checkWin();
        if (!gameover) turn = "X";
      }
    }
  });
}


function findBestMove() {
  // Simple algorithm: choose the first available empty cell
  return board.findIndex((cell) => cell === "");
}

function findBlockingCombo(playerMark, computerMark) {
  const playerThreatCells = [6, 1, 4, 11, 25, 18, 23, 28];
  const computerResponseCells = [1, 4, 18, 25];

  // Check if the player is attempting to score in specific cells
  for (let i = 0; i < playerThreatCells.length; i++) {
    const threatCell = playerThreatCells[i];
    if (board[threatCell] === playerMark) {
      const responseCell = computerResponseCells[i];
      if (board[responseCell] === "") {
        return [responseCell];
      }
    }
  }
  const highPriorityCombos = [
    [6, 1],
    [11, 4],
    [25, 18],
    [18, 25],
    // Add other high-priority combos as needed
  ];

  // Check high-priority combos first
  for (let i = 0; i < highPriorityCombos.length; i++) {
    const combo = highPriorityCombos[i];
    const emptyCellIndices = combo.filter((index) => board[index] === "");
    const playerMarks = combo.filter((index) => board[index] === playerMark);
    const computerMarks = combo.filter(
      (index) => board[index] === computerMark
    );

    if (
      emptyCellIndices.length === 1 &&
      (playerMarks.length === 2 || computerMarks.length === 2)
    ) {
      return combo;
    }
  }

  // If no immediate threat found in high-priority combos, check all combos
  const winCombos = getWinningCombination();
  for (let i = 0; i < winCombos.length; i++) {
    const combo = winCombos[i];
    const emptyCellIndices = combo.filter((index) => board[index] === "");
    const playerMarks = combo.filter((index) => board[index] === playerMark);
    const computerMarks = combo.filter(
      (index) => board[index] === computerMark
    );

    if (
      emptyCellIndices.length === 1 &&
      (playerMarks.length === 2 || computerMarks.length === 2)
    ) {
      return combo;
    }
  }

  return null;
}

function updateScoreboard() {
  document.getElementById("playerScore").textContent =
    "Player: " + player1Score;
  document.getElementById("computerScore").textContent =
    "Computer: " + computerScore;
}

function handleWin(player, winCombo) {
  gameover = true;

  if (player === "X") {
    player1Score++;
  } else {
    computerScore++;
  }
  updateScoreboard();

  // Highlight the winning combination
  var cells = document.getElementsByTagName("td");
  for (var i = 0; i < winCombo.length; i++) {
    var index = winCombo[i];
    cells[index].classList.add("highlight");
  }

  // Introduce a delay before resetting for the next round
  setTimeout(function () {
    // Reset the displayed winning combination and remove highlighting
    for (var i = 0; i < winCombo.length; i++) {
      var index = winCombo[i];
      cells[index].innerHTML = "";
      cells[index].classList.remove("highlight");
    }

    // Reset the game after the delay
    resetGame();

    if (player1Score >= 5 || computerScore >= 5) {
      // Show a popup window for the match winner
      var popup = document.createElement("div");
      popup.className = "popup";
      var message = document.createElement("p");
      message.textContent =
        player1Score >= 5
          ? "Player 1 wins the match!"
          : "Computer wins the match!";
      var closeButton = document.createElement("button");
      closeButton.textContent = "Play Again";
      closeButton.onclick = function () {
        document.body.removeChild(popup);
        resetGame();
        player1Score = 0;
        computerScore = 0;
        updateScoreboard();
      };

      popup.appendChild(message);
      popup.appendChild(closeButton);
      document.body.appendChild(popup);
    }
  }, 1000);
}

function resetGame() {
  board = Array(36).fill("");
  gameover = false;
  turn = "X";

  const cells = document.getElementsByTagName("td");
  for (const cell of cells) {
    cell.innerHTML = board[parseInt(cell.id.match(/\d+/g).pop())];
    cell.classList.remove("highlight");
  }

  setTimeout(() => {
    if (!gameover) cells.forEach((cell) => (cell.innerHTML = board[parseInt(cell.id.match(/\d+/g).pop())]));
  }, 1000);
}

function checkWin() {
  var winCombos = getWinningCombination();
  var isDraw = true;

  for (var i = 0; i < winCombos.length; i++) {
    var combo = winCombos[i];
    var player = board[combo[0]];

    if (player) {
      var isWin = true;
      for (var j = 1; j < combo.length; j++) {
        if (board[combo[j]] !== player) {
          isWin = false;
          break;
        }
      }

      if (isWin) {
        handleWin(player, combo);
        return;
      }
    }

    // Check for draw
    for (var k = 0; k < combo.length; k++) {
      if (board[combo[k]] === "") {
        isDraw = false;
        break;
      }
    }
  }

  if (isDraw) {
    gameover = true;
    showDrawPopup();
    resetGame();
  }
}

function showDrawPopup() {
  var popup = document.createElement("div");
  popup.className = "popup";
  var message = document.createElement("p");
  message.textContent = "It's a Draw!";
  var closeButton = document.createElement("button");
  closeButton.textContent = "Play Again";
  closeButton.onclick = function () {
    document.body.removeChild(popup);
    resetGame();
  };

  popup.appendChild(message);
  popup.appendChild(closeButton);
  document.body.appendChild(popup);
}

function getWinningCombination() {
  var winCombos = [
    [0, 1, 2, 3, 4, 5],
    [6, 7, 8, 9, 10, 11],
    [12, 13, 14, 15, 16, 17],
    [18, 19, 20, 21, 22, 23],
    [24, 25, 26, 27, 28, 29],
    [0, 6, 12, 18, 24],
    [1, 7, 13, 19, 25],
    [2, 8, 14, 20, 26],
    [3, 9, 15, 21, 27],
    [4, 10, 16, 22, 28],
    [5, 11, 17, 23, 29],
    [6, 1],
    [12, 7, 2],
    [18, 13, 8, 3],
    [24, 19, 14, 9, 4],
    [25, 20, 15, 10, 5],
    [26, 21, 16, 11],
    [27, 22, 17],
    [28, 23],
    [11, 4],
    [17, 10, 3],
    [23, 16, 9, 2],
    [29, 22, 15, 8, 1],
    [28, 21, 14, 7, 0],
    [27, 20, 13, 6],
    [26, 19, 12],
    [25, 18],
    [25, 18], // Top Right to Bottom Left diagonal
    [18, 25], // Bottom Left to Top Right diagonal
  ];
  return winCombos;
}

function highlightWinningCombo(winCombo) {
  var cells = document.getElementsByTagName("td");
  for (var i = 0; i < winCombo.length; i++) {
    var index = winCombo[i];
    cells[index].classList.add("highlight");
  }
}

function handleWin(player, winCombo) {
  gameover = true;
  const cells = document.getElementsByTagName("td");

  if (player === "X") player1Score++;
  else computerScore++;

  updateScoreboard();

  if (player1Score >= 5 || computerScore >= 5) {
    const popup = createPopup(player1Score >= 5 ? "Player 1" : "Computer");
    document.body.appendChild(popup);

    setTimeout(() => {
      document.body.removeChild(popup);
      resetGame();
      player1Score = 0;
      computerScore = 0;
      updateScoreboard();
    }, 1000);
  } else {
    highlightWinningCombo(winCombo);

    setTimeout(() => {
      for (const index of winCombo) {
        cells[index].innerHTML = "";
        cells[index].classList.remove("highlight");
      }

      resetGame();
    }, 1000);
  }
}

function updateScoreboard() {
  document.getElementById("playerScore").textContent =
    "Player: " + player1Score;
  document.getElementById("computerScore").textContent =
    "Computer: " + computerScore;
}

function createPopup(winner) {
  const popup = document.createElement("div");
  popup.className = "popup";
  const message = document.createElement("p");
  message.textContent = `${winner} wins the match!`;
  const closeButton = document.createElement("button");
  closeButton.textContent = "Play Again";
  closeButton.onclick = () => {
    document.body.removeChild(popup);
    resetGame();
  };

  popup.appendChild(message);
  popup.appendChild(closeButton);
  return popup;
}

// Initialize the game
resetGame();