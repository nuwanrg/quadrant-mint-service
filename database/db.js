// db.js

require("dotenv").config(); // loads variables from .env into process.env

const { Pool } = require("pg");

// console.log(process.env.DB_USER);

const pool = new Pool({
  user: process.env.DB_USER, // your database user
  host: process.env.DB_HOST, // PostgreSQL server address
  database: process.env.DB_NAME, // your database name
  password: process.env.DB_PASS, // your database password
  port: process.env.DB_PORT, // PostgreSQL server port, default is 5432
  ssl: {
    rejectUnauthorized: false,
  },
  max: process.env.DB_POOL_SIZE, // increase max pool size to 20
});

module.exports = pool;
