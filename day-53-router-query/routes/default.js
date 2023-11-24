const express = require("express");
const router = express.Router();

router.get("/", function (req, res) {
  // no need to add .ejs extension, because it's already set in app.set("view engine", "ejs");
  res.render("index");
});

router.get("/about", function (req, res) {
  res.render("about");
});

module.exports = router;
