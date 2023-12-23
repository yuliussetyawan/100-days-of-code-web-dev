const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  database: 'security',
  user: 'root',
  password: '',
  // activate ability to execute multiple different query statements
  // set to false to prevent sql attacks
  multipleStatements: true
})

module.exports = pool;