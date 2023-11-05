let paragraphElement = document.querySelector("p");

function changeParagraphText() {
  paragraphElement.textContent = "Clicked";
  console.log('paragraph clicked');
}

paragraphElement.addEventListener("click", changeParagraphText);

let inputElement = document.querySelector('input');

function retrieveUserInput(event){
  // let enteredText = inputElement.value;
  let enteredText = event.target.value;
  // let enteredText = event.data;  => This is different, it will log the single character only
  console.log(enteredText);
}

inputElement.addEventListener('input', retrieveUserInput)

