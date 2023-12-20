const express = require("express");
// npm install bcryptjs
const bcrypt = require("bcryptjs");
const db = require("../data/database");

const router = express.Router();

router.get("/", function (req, res) {
  res.render("welcome");
});

router.get("/signup", function (req, res) {
  let sessionInputData = req.session.inputData;
  // if visiting the page for the first time (there is no input data)
  if (!sessionInputData) {
    sessionInputData = {
      hasError: false,
      email: "",
      confirmEmail: "",
      password: "",
    };
  }
  // flashing value onto the one session just to have it for the next request
  req.session.inputData = null;
  
  res.render("signup", { inputData: sessionInputData });
});

router.get("/login", function (req, res) {
  res.render("login");
});

router.post("/signup", async function (req, res) {
  const userData = req.body;
  const enteredEmail = userData.email; // userData['email']
  const enteredConfirmedEmail = userData["confirm-email"];
  const enteredPassword = userData.password;

  // validating input
  if (
    !enteredEmail ||
    !enteredConfirmedEmail ||
    !enteredPassword ||
    enteredPassword.trim().length < 6 ||
    enteredEmail !== enteredConfirmedEmail ||
    !enteredEmail.includes("@")
  ) {
    req.session.inputData = {
      hasError: true,
      message: "Invalid input - please check your data",
      email: enteredEmail,
      confirmEmail: enteredConfirmedEmail,
      password: enteredPassword,
    };
    // only redirect after the session is save
    req.session.save(function () {
      res.redirect("/signup");
    });
    // "return" always applies to only the function in which it's used - not any other surrounding functions
    return;
  }

  // check if user is already exist
  const existingUser = await db
    .getDb()
    .collection("users")
    .findOne({ email: enteredEmail });
  if (existingUser) {
    console.log("User already exist");
    return res.redirect("/signup");
  }

  const hashedPassword = await bcrypt.hash(enteredPassword, 12);

  const user = {
    email: enteredEmail,
    password: hashedPassword,
  };
  await db.getDb().collection("users").insertOne(user);
  res.redirect("/login");
});

router.post("/login", async function (req, res) {
  const userData = req.body;
  const enteredEmail = userData.email;
  const enteredPassword = userData.password;

  const existingUser = await db
    .getDb()
    .collection("users")
    .findOne({ email: enteredEmail });
  if (!existingUser) {
    console.log("Users not found");
    return res.redirect("/login");
  }

  const passwordsAreEqual = await bcrypt.compare(
    enteredPassword,
    existingUser.password
  );
  if (!passwordsAreEqual) {
    console.log("Could not login, password are not equal");
    return res.redirect("/login");
  }
  // session property is provided by express-session package, meanwhile .user is added property which is not listed
  req.session.user = { id: existingUser._id, email: existingUser.email };
  req.session.isAuthenticated = true;
  // res.redirect() will only execute when saved to the database
  req.session.save(function () {
    console.log("User is authenticated");
    res.redirect("/admin");
  });
});

router.get("/admin", function (req, res) {
  if (!req.session.isAuthenticated) {
    // if (!req.session.user)
    return res.status(401).render("401");
  }
  res.render("admin");
});

router.post("/logout", function (req, res) {
  req.session.user = null;
  req.session.isAuthenticated = false;
  res.redirect("/");
});

module.exports = router;
