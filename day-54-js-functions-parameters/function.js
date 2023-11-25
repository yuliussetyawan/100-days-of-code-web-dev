// default parameters
function greetUser(greetingPrefix, userName = "user") {
  // console.log(greetingPrefix + " " + userName + "!");
  console.log(`${greetingPrefix} ${userName}!`);
}

// if default parameters isn't added, the value will be undefined
greetUser("Hi", "Yulius");
greetUser("Hello");

// rest parameters => combine amount of received parameters into an array
function sumUp(...numbers) {
  let result = 0;
  for (const number of numbers) {
    result += number;
  }
  return result;
}

const inputNumbers = [1, 5, 7, 10, 15];
// spread operator => split array or object into a comma separated list of values
console.log(...inputNumbers);
console.log(sumUp(...inputNumbers));
