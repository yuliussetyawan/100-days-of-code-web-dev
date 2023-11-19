const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

// passed to all request (explicitly tell express it should parse and translate any data that attached in coming requests)
app.use(express.urlencoded({ extended: false }));

app.get("/currenttime", function (req, res) {
  // express will set the default statusCode to 200
  res.send("<h1>" + new Date().toISOString() + "</h1>");
});

app.get("/", function (req, res) {
  res.send(
    "<form action='/store-user' method='POST'><label for='username'>Your Name</label><input type='text' id='username' name='username'/><button type='SUBMIT'>Submit</button></form>"
  );
});

app.post("/store-user", function (req, res) {
  const username = req.body.username;
  const filePath = path.join(__dirname, "data", "users.json");
  const fileData = fs.readFileSync(filePath);
  const existingUsers = JSON.parse(fileData);
  existingUsers.push(username);
  fs.writeFileSync(filePath, JSON.stringify(existingUsers));
  res.send("<h1>Username stored</h1>");
});

app.get('/users', function(req, res){
  const filePath = path.join(__dirname, 'data', 'users.json');
  const fileData = fs.readFileSync(filePath);
  const existingUsers = JSON.parse(fileData);
  let responseData = '<ul>'
  for (const user of existingUsers){
    responseData += '<li>' + user + '</li>'
  }
  responseData += '</ul>'
  res.send(responseData);
})

app.listen(3000);
