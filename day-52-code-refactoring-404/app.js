const path = require("path");
const fs = require("fs");

const express = require("express");
const uuid = require("uuid");

const resData = require("./util/restaurant-data");

const app = express();

// set templating engine
app.set("view engine", "ejs");

// set html path for ejs
app.set("views", path.join(__dirname, "views"));

// any content in the public folders are accessible to the public
app.use(express.static("public"));

app.use(express.urlencoded({ extended: false }));

app.get("/", function (req, res) {
  // no need to add .ejs extension, because it's already set in line 9;
  res.render("index");
});

app.get("/restaurants", function (req, res) {
  const storedRestaurants = resData.getStoredRestaurants();
  res.render("restaurants", {
    numberOfRestaurants: storedRestaurants.length,
    restaurants: storedRestaurants,
  });
});

app.get("/restaurants/:id", function (req, res) {
  const restaurantId = req.params.id;
  const storedRestaurants = resData.getStoredRestaurants()

  for (const restaurant of storedRestaurants) {
    if (restaurant.id === restaurantId) {
      res.render("restaurant-detail", { restaurant: restaurant });
    }
  }
  // Page not found
  res.status(404).render("404");
});

app.get("/recommend", function (req, res) {
  res.render("recommend");
});

// set dynamic routing
app.post("/recommend", function (req, res) {
  const restaurant = req.body;
  // create dynamic id
  restaurant.id = uuid.v4();
  const restaurants = resData.getStoredRestaurants();
  restaurants.push(restaurant);
  resData.storedRestaurants(restaurants);
  res.redirect("/confirm");
});

app.get("/confirm", function (req, res) {
  res.render("confirm");
});

app.get("/about", function (req, res) {
  res.render("about");
});

// fallback for non existent routes
app.use(function (req, res) {
  res.status(404).render("404");
});

// handle server-side error
app.use(function (error, req, res, next) {
  res.status(500).render("500");
});

app.listen(3000);
