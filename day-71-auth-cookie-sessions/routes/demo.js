const express = require("express");
// npm install bcryptjs
const bcrypt = require("bcryptjs");
const db = require("../data/database");


const router = express.Router();

router.get("/", function (req, res) {
  res.render("welcome");
});

router.get("/signup", function (req, res) {
  res.render("signup");
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
  if (!enteredEmail || !enteredConfirmedEmail || !enteredPassword || enteredPassword.trim().length < 6 || enteredEmail !== enteredConfirmedEmail || !enteredEmail.includes('@')){
    console.log('Incorrect data');
    return res.redirect('/signup')
  }

  // check if user is already exist
  const existingUser = await db.getDb().collection('users').findOne({email: enteredEmail})
  if(existingUser) {
    console.log('User already exist');
    return res.redirect('/signup')
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
  console.log('User is authenticated');
  res.redirect('/admin')

});

router.get("/admin", function (req, res) {
  res.render("admin");
});

router.post("/logout", function (req, res) {});

module.exports = router;
