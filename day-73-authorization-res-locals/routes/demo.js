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
  let sessionInputData = req.session.inputData;
  // if visiting the page for the first time (there is no input data)
  if (!sessionInputData) {
    sessionInputData = {
      hasError: false,
      email: "",
      password: "",
    };
  }

  // flashing value onto the one session just to have it for the next request
  req.session.inputData = null;

  res.render("login", { inputData: sessionInputData });
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
    req.session.inputData = {
      hasError: true,
      message: "User already exist",
      email: enteredEmail,
      confirmEmail: enteredConfirmedEmail,
      password: enteredPassword,
    };
    req.session.save(function () {
      res.redirect("/signup");
    });
    return;
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
    req.session.inputData = {
      hasError: true,
      message: "Could not log you in - please check your credentials!",
      email: enteredEmail,
      password: enteredPassword,
    };
    req.session.save(function () {
      res.redirect("/login");
    });
    return;
  }

  const passwordsAreEqual = await bcrypt.compare(
    enteredPassword,
    existingUser.password
  );
  if (!passwordsAreEqual) {
    req.session.inputData = {
      hasError: true,
      message: "Could not log you in - please check your credentials!",
      email: enteredEmail,
      password: enteredPassword,
    };
    req.session.save(function () {
      res.redirect("/login");
    });
    return;
  }
  // session property is provided by express-session package, meanwhile .user is added property which is not listed
  req.session.user = { id: existingUser._id, email: existingUser.email };
  req.session.isAuthenticated = true;
  // res.redirect() will only execute when saved to the database
  req.session.save(function () {
    console.log("User is authenticated");
    res.redirect("/profile");
  });
});

router.get("/admin", async function (req, res) {
  /*
  if (!req.session.isAuthenticated) {
    // if (!req.session.user)
    return res.status(401).render("401");
  }
  const user = await db
    .getDb()
    .collection("users")
    .findOne({ _id: req.session.user.id });

  if (!user || !user.isAdmin) {
    return res.status(403).render("403");
  }
  */

  // USE res.locals already
  if (!res.locals.isAuth) {
    return res.status(401).render("401");
  }
  if (!res.locals.isAdmin) {
    return res.status(403).render("403");
  }

  res.render("admin");
});

// db.users.updateOne({_id: ObjectId('6582947e34bb3c5c8458500a')}, {$set: {isAdmin: true}})
router.get("/profile", function (req, res) {
  /*
  if (!req.session.isAuthenticated) {
    // if (!req.session.user)
    return res.status(401).render("401");
  }
  */

  // USE res.locals already
  if (!res.locals.isAuth) {
    return res.status(401).render("401");
  }
  res.render("profile");
});

router.post("/logout", function (req, res) {
  req.session.user = null;
  req.session.isAuthenticated = false;
  res.redirect("/");
});

module.exports = router;
