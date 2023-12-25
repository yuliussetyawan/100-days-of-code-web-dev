const express = require("express");
const authController = require("../controllers/auth-controller");
const router = express.Router();

// auth includes signup, login, and logout function
router.get("/signup", authController.getSignup);

router.get("/login", authController.getLogin );

router.post("/signup", authController.signup);

router.post("/login", authController.login);

router.post("/logout", authController.logout);

module.exports = router;
