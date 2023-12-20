const path = require("path");
const express = require("express");
// npm install express-session
const session = require("express-session");
// npm install connect-mongodb-session
const MongoDBStore = require("connect-mongodb-session")(session);

const db = require("./data/database");
const demoRoutes = require("./routes/demo");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

const sessionStore = new MongoDBStore({
  uri: "mongodb://localhost:27017",
  databaseName: "auth-demo",
  collection: "sessions",
});

// initialize session with mongodb
app.use(
  session({
    secret: "super-secret",
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    // set cookie expiration (in ms)
    // cookie: {
    //   maxAge: 30 * 24 * 60 * 60 * 100
    // }
  })
);

app.use(async function (req, res, next) {
  const user = req.session.user;
  const isAuth = req.session.isAuthenticated;
  if (!user || !isAuth) {
    // move on to the next middleware (move on to the demoRoutes)
    return next();
  }
  const userDoc = await db
    .getDb()
    .collection("users")
    .findOne({ _id: user.id });
  const isAdmin = userDoc.isAdmin;
  // res.locals allows you to set some global values, that available in this entire request response cycle (available in the entire template)
  res.locals.isAuth = isAuth;
  res.locals.isAdmin = isAdmin;
  next();
});

app.use(demoRoutes);

app.use(function (error, req, res, next) {
  res.render("500");
});

db.connectToDatabase().then(function () {
  app.listen(3000);
});
