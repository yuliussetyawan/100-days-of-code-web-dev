const express = require("express");
const quoteControllers = require("../controllers/quote.controllers");

const router = express.Router();

router.get("/", quoteControllers.getRandomQuote);

module.exports = router;
