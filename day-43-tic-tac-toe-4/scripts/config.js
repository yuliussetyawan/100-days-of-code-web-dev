function openPlayerConfig(event) {
  editedPlayer = +event.target.dataset.playerid; // +'1' => 1
  playerConfigOverlayElement.style.display = "block";
  backdropElement.style.display = "block";
}

function closePlayerConfig() {
  playerConfigOverlayElement.style.display = "none";
  backdropElement.style.display = "none";
  formElement.firstElementChild.classList.remove("error");
  errorsOutputElement.textContent = "";
  document.getElementById("playername").value = "";
}

function savePlayerConfig(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const enteredPlayername = formData.get("playername").trim(); // '      ' => ''

  if (!enteredPlayername) {
    // enteredPlayername === ''
    event.target.firstElementChild.classList.add("error"); // target form-control class
    errorsOutputElement.textContent = "Please enter a valid name!";
    return;
  }

  const updatedPlayerDataElement = document.getElementById(
    `player-${editedPlayer}-data`
  );
  updatedPlayerDataElement.children[1].textContent = enteredPlayername;

  // storing player name data
  players[editedPlayer - 1].name = enteredPlayername;

  closePlayerConfig();
}
