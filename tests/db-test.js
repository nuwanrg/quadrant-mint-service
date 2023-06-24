const pool = require("../database/db.js");

pool.query("SELECT 1", (error, results) => {
  if (error) {
    console.log("Not Connected successfully to PostgreSQL!");
    throw error;
  }
  console.log("Connected successfully to PostgreSQL!");
  pool.end();
});
