const express = require("express");
const uuid = require("uuid");

const router = express.Router();

const resData = require("../util/restaurant-data");

router.get("/restaurants", function (req, res) {
  let order = req.query.order;
  let nextOrder = "desc";

  if (order !== "asc" && order !== "desc") {
    order = "asc";
  }

  if (order === "desc") {
    nextOrder = "asc";
  }

  const storedRestaurants = resData.getStoredRestaurants();

  // 
  storedRestaurants.sort(function (resA, resB) {
    if (
      (order === "asc" && resA.name > resB.name) ||
      (order === "desc" && resB.name > resA.name)
    ) {
      return 1;
    }
    return -1;
  });

  res.render("restaurants", {
    numberOfRestaurants: storedRestaurants.length,
    restaurants: storedRestaurants,
    nextOrder: nextOrder,
  });
});

router.get("/restaurants/:id", function (req, res) {
  const restaurantId = req.params.id;
  const storedRestaurants = resData.getStoredRestaurants();

  for (const restaurant of storedRestaurants) {
    if (restaurant.id === restaurantId) {
      res.render("restaurant-detail", { restaurant: restaurant });
    }
  }
  // Page not found
  res.status(404).render("404");
});

router.get("/recommend", function (req, res) {
  res.render("recommend");
});

// set dynamic routing
router.post("/recommend", function (req, res) {
  const restaurant = req.body;
  // create dynamic id
  restaurant.id = uuid.v4();
  const restaurants = resData.getStoredRestaurants();
  restaurants.push(restaurant);
  resData.storedRestaurants(restaurants);
  res.redirect("/confirm");
});

router.get("/confirm", function (req, res) {
  res.render("confirm");
});

module.exports = router;
