document.addEventListener("DOMContentLoaded", function () {
  var menuButton = document.getElementById("Menu");
  var modal = document.getElementById("myModal");
  var confirmYes = document.getElementById("confirmYes");
  var confirmNo = document.getElementById("confirmNo");

  menuButton.addEventListener("click", function() {
    modal.style.display = "block"; // Display the modal

    confirmYes.onclick = function() {
      var menuURL = "Game-Menu.html";
      window.location.href = menuURL;
      modal.style.display = "none"; // Hide the modal after confirming
    }

    confirmNo.onclick = function() {
      modal.style.display = "none"; // Hide the modal if the player cancels
    }
  });
});


// Still no algorithm

// Place algorithm here..