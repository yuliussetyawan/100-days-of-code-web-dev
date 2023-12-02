// make sure that all the query methods we execute will yield promises to us
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  database: "blog",
  user: "root",
  password: "",
});

module.exports = pool;
