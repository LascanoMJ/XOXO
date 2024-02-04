document.addEventListener("DOMContentLoaded", function () {
  var menuButton = document.getElementById("Menu");
  var modal = document.getElementById("myModal");
  var confirmYes = document.getElementById("confirmYes");
  var confirmNo = document.getElementById("confirmNo");

  menuButton.addEventListener("click", function() {
    modal.style.display = "block";

    confirmYes.onclick = function() {
      var menuURL = "index.html";
      window.location.href = menuURL;
      modal.style.display = "none"; // Hide the modal after confirming
    }

    confirmNo.onclick = function() {
      modal.style.display = "none"; // Hide the modal if the player cancels
    }
  });
});


var board = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""];
var turn = "X";
var gameover = false;
var player1Score = 0;
var player2Score = 0;

function placemarker(cell) {
  if (!gameover && cell.innerHTML == "") {
    var idParts = cell.id.match(/\d+/g);
    var index = parseInt(idParts[idParts.length - 1]);
    cell.innerHTML = turn;
    board[index] = turn;
    checkWin();
    if (!gameover) {
      turn = turn === "X" ? "O" : "X";
    }
  }
}

function updateScoreboard() {
  document.getElementById("player1Score").textContent = "Player 1: " + player1Score;
  document.getElementById("player2Score").textContent = "Player 2: " + player2Score;
}

function handleWin(player, winCombo) {
  gameover = true;

  if (player === "X") {
    player1Score++;
  } else {
    player2Score++;
  }
  updateScoreboard();

  // Highlight the winning combination
  var cells = document.getElementsByTagName("td");
  for (var i = 0; i < winCombo.length; i++) {
    var index = winCombo[i];
    cells[index].classList.add("highlight");
  }

  if (player1Score >= 5 || player2Score >= 5) {
    // Show a popup window for the match winner
    var popup = document.createElement("div");
    popup.className = "popup";
    var message = document.createElement("p");
    message.textContent = player1Score >= 5 ? "Player 1 wins the match!" : "Player 2 wins the match!";
    var closeButton = document.createElement("button");
    closeButton.textContent = "Play Again";
    closeButton.onclick = function () {
      document.body.removeChild(popup);
      resetGame();
      player1Score = 0;
      player2Score = 0;
      updateScoreboard();
    };

    popup.appendChild(message);
    popup.appendChild(closeButton);
    document.body.appendChild(popup);
  }

  // Introduce a 1-second delay before resetting for the next round
  setTimeout(function () {
    // Reset the game
    resetGame();

    // Reset the displayed winning combination and remove highlighting
    for (var i = 0; i < winCombo.length; i++) {
      var index = winCombo[i];
      cells[index].innerHTML = "";
      cells[index].classList.remove("highlight");
    }
  }, 1000);
}

function resetGame() {
  // Reset board and game state
  board = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""];
  gameover = false;
  turn = "X";

  // Reset UI by clearing cell content and removing highlighting
  var cells = document.getElementsByTagName("td");
  for (var i = 0; i < cells.length; i++) {
    cells[i].innerHTML = board[i];
    cells[i].classList.remove("highlight");
  }

  // Introduce a 1-second delay before moving to the next round
  setTimeout(function () {
    if (!gameover) {
      // Update UI to show Xs and Os
      for (var i = 0; i < cells.length; i++) {
        cells[i].innerHTML = board[i];
      }
    }
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
    [0, 1, 2, 3, 4, 5], [6, 7, 8, 9, 10, 11], [12, 13, 14, 15, 16, 17], [18, 19, 20, 21, 22, 23], [24, 25, 26, 27, 28, 29],
    [0, 6, 12, 18, 24], [1, 7, 13, 19, 25], [2, 8, 14, 20, 26], [3, 9, 15, 21, 27], [4, 10, 16, 22, 28], [5, 11, 17, 23, 29],
    [6, 1], [12, 7, 2], [18, 13, 8, 3], [24, 19, 14, 9, 4], [25, 20, 15, 10, 5], [26, 21, 16, 11], [27, 22, 17], [28, 23],
    [11, 4], [17, 10, 3], [23, 16, 9, 2], [29, 22, 15, 8, 1], [28, 21, 14, 7, 0], [27, 20, 13, 6], [26, 19, 12], [25, 18],
    [25, 18], // Top Right to Bottom Left diagonal
    [18, 25], // Bottom Left to Top Right diagonal
  ];
  return winCombos;
}

// Initialize the game
resetGame();