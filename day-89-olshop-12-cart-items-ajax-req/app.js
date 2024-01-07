// embedded package
const path = require("path");

// 3rd party package
const express = require("express");
const csrf = require("csurf");
const expressSession = require("express-session");

// local package
const createSessionConfig = require("./config/session");
const db = require("./data/database");

const addCsrfTokenMiddleware = require("./middlewares/csrf-token");
const errorHandlerMiddleware = require("./middlewares/error-handler");
const chekAuthStatusMiddleware = require("./middlewares/check-auth");
const protectRoutes = require("./middlewares/protect-routes");
const cartMiddleware = require('./middlewares/cart');

const authRoutes = require("./routes/auth.routes");
const productsRoutes = require("./routes/products.routes");
const baseRoutes = require("./routes/base.routes");
const adminRoutes = require("./routes/admin.routes");
const cartRoutes = require('./routes/cart.routes');

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static("public"));
// camouflage 'product-data' folder into '/products/assets'
app.use("/products/assets", express.static("product-data"));
// extract any attached request data for all incoming requests
app.use(express.urlencoded({ extended: false }));
// check incoming request for json data (ajax)
app.use(express.json());

const sessionConfig = createSessionConfig();

app.use(expressSession(sessionConfig));
app.use(csrf());

app.use(cartMiddleware)
app.use(addCsrfTokenMiddleware);
app.use(chekAuthStatusMiddleware);

app.use(baseRoutes);
app.use(authRoutes);
app.use(productsRoutes);
app.use('/cart', cartRoutes);
app.use(protectRoutes);   // protect admin routes for unauthorized access
app.use("/admin", adminRoutes);

app.use(errorHandlerMiddleware);

db.connectToDatabase()
  .then(function () {
    app.listen(3000);
  })
  .catch(function (error) {
    console.log("Failed to connect to the database!");
    console.log(error);
  });
