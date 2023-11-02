let age = 23;
let userName = "Yulius";
let hobbies = ["Sports", "coding", "Reading"];
let job = { title: "Developer", location: "Indonesia", salary: 5000000 };

// alert(hobbies[0]);
// accesing object value
// alert(job.title);

let totalAdultYears;

function calculateAdultYears(userAge) {
  let result;
  result = userAge - 18;
  return result;
}
// age  = 23
totalAdultYears = calculateAdultYears(age);
alert(totalAdultYears);

age = 45;
totalAdultYears = calculateAdultYears(age);

alert(totalAdultYears);
