const path = require("path");
const express = require("express");
// npm install express-session
const session = require('express-session')
// npm install connect-mongodb-session
const MongoDBStore = require('connect-mongodb-session')(session);

const db = require("./data/database");
const demoRoutes = require("./routes/demo");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

const sessionStore = new MongoDBStore({
  uri: 'mongodb://localhost:27017',
  databaseName: 'auth-demo',
  collection: 'sessions'
});

// initialize session with mongodb
app.use(session({
  secret: 'super-secret',
  resave: false,
  saveUninitialized: false,
  store: sessionStore
}))

app.use(demoRoutes);

app.use(function (error, req, res, next) {
  res.render("500");
});

db.connectToDatabase().then(function () {
  app.listen(3000);
});
