const path = require("path");

const express = require("express");
const session = require("express-session");
const csrf = require("csurf");

const sessionConfig = require("./config/session");
const db = require("./data/database");
const authRoutes = require("./routes/auth");
const blogRoutes = require("./routes/blog");
const authMiddleware = require("./middleware/auth-middleware");
const addCSRFTokenMiddleware = require("./middleware/csrf-token-middleware");

// function in session.js
const mongoDbSessionStore = sessionConfig.createSessionStore(session);

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// function in session.js
app.use(session(sessionConfig.createSessionConfig(mongoDbSessionStore)));

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

app.use(session());
app.use(csrf());

app.use(addCSRFTokenMiddleware);
// execute by express once get incoming requests
app.use(authMiddleware);

app.use(blogRoutes);
app.use(authRoutes);

app.use(function (error, req, res, next) {
  res.render("500");
});

db.connectToDatabase().then(function () {
  app.listen(3000);
});
