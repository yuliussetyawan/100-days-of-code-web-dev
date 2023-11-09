// First Example: Sum numbers

const calculateSumButtonElement = document.querySelector("#calculator button");

function calculateSum() {
  const userNumberInputElement = document.getElementById("user-number");
  const enteredNumber = userNumberInputElement.value;

  let sumUpToNumber = 0;

  for (let i = 0; i <= enteredNumber; i++) {
    sumUpToNumber += i;
  }
  const outputResultElement = document.getElementById("calculated-sum");
  outputResultElement.textContent = sumUpToNumber;
  outputResultElement.style.display = "block";
}

calculateSumButtonElement.addEventListener("click", calculateSum);

// Highlight Links
const higlightLinksButtonElement = document.querySelector(
  "#highlight-links button"
);

function highlightLinks() {
  const anchorElements = document.querySelectorAll("#highlight-links a");
  for (const anchorElement of anchorElements) {
    anchorElement.classList.add("highlight");
  }
}

higlightLinksButtonElement.addEventListener("click", highlightLinks);

// Display user data

const dummyData = {
  firstName: "Yulius",
  lastName: "Setyawan",
  age: 23,
};

const displayUserDataButtonElement =
  document.querySelector("#user-data button");

function displayUserData() {
  const outputDataElement = document.getElementById("output-user-data");

  outputDataElement.innerHTML = "";

  for (const key in dummyData) {
    const newUserDataListElement = document.createElement("li");
    newUserDataListElement.textContent =
      key.toUpperCase() + ": " + dummyData[key];
    outputDataElement.append(newUserDataListElement);
  }
}

displayUserDataButtonElement.addEventListener("click", displayUserData);

// Statistics / Roll the Dice

const rollDiceButtonElement = document.querySelector("#statistics button");

function rollDice() {
  return Math.floor(Math.random() * 6) + 1; // Math.floor(): 5.64 => 5
}

function deriveNumberOfDiceRolls() {
  const targetNumberInputElement =
    document.getElementById("user-target-number");
  const diceRollListElement = document.getElementById("dice-rolls");
  // +convert to number
  const enteredNumber = +targetNumberInputElement.value;
  diceRollListElement.innerHTML = "";

  let hasRolledTargetNumber = false;
  let numberOfRolls = 0;

  while (!hasRolledTargetNumber) {
    const rolledNumber = rollDice();
    // if (rolledNumber == enteredNumber) {
    //   hasRolledTargetNumber = true;
    // }
    numberOfRolls++;
    const newRollListElement = document.createElement("li");
    const outputText = "Roll " + numberOfRolls + ": " + rolledNumber;
    newRollListElement.textContent = outputText;
    diceRollListElement.append(newRollListElement);
    hasRolledTargetNumber = rolledNumber === enteredNumber;
  }
  const outputTotalRollsElement = document.getElementById("output-total-rolls");
  const outputTargetNumberElement = document.getElementById(
    "output-target-number"
  );

  outputTargetNumberElement.textContent = enteredNumber;
  outputTotalRollsElement.textContent = numberOfRolls;
}

rollDiceButtonElement.addEventListener("click", deriveNumberOfDiceRolls);
