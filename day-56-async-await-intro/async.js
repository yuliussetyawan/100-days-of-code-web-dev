const fs = require("fs/promises");

function readFile() {
  let fileData;

  // the callback function will only be called once the operation is finished.

  // fs.readFile('data.txt', function(error, fileData) {
  // if (error) {
  //   // ...
  // }
  //   console.log('File parsing done!');
  //   console.log(fileData.toString());
  //   // start another async task that sends the data to a database
  // });

  fs.readFile("data.txt")
    .then(function (fileData) {
      console.log("File parsing done!");
      console.log(fileData.toString());
      // return anotherAsyncOperation;
    })
    .then(function () {})
    .catch(function (error) {
      console.log(error);
    });

  console.log("Hi there!");
}

readFile();
