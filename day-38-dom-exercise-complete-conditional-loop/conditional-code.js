const myName = "Yulius";

if (myName === "Yulius") {
  // execute if the value is true
  console.log(Hello);
}

let isLoggedIn = true;

// this is not true
if (!isLoggedIn) {
  console.log("User is NOT logged in");
}

// 6 falsy values false: 0, '', null, undefined, NaN
const enteredUserName = ""; // 0

if (enteredUserName) {
  console.log("Input is valid");
}