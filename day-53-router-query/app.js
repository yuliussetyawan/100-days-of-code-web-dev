const path = require("path");
const fs = require("fs");

const express = require("express");

const defaultRoutes = require("./routes/default");
const restaurantRoutes = require("./routes/restaurants");

const app = express();

// set templating engine
app.set("view engine", "ejs");

// set html path for ejs
app.set("views", path.join(__dirname, "views"));

// any content in the public folders are accessible to the public
app.use(express.static("public"));

app.use(express.urlencoded({ extended: false }));

// express router
// every req start "/" since every req is at least targeting <your-domain>/something (even if it's just your <your-domain>/)
app.use("/", defaultRoutes);
app.use("/", restaurantRoutes);

// fallback for non existent routes
app.use(function (req, res) {
  res.status(404).render("404");
});

// handle server-side error
app.use(function (error, req, res, next) {
  res.status(500).render("500");
});

app.listen(3000);
