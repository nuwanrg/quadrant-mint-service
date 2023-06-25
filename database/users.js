// users.js
require("dotenv").config();
const pool = require("./db");
const fs = require("fs");

async function dropUsersTable() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const queryText = `DROP TABLE IF EXISTS quad_users CASCADE`;
    const res = await client.query(queryText);
    const commit = await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error dropping table:", err);
  } finally {
    client.release();
  }
}

async function getUsers() {
  const client = await pool.connect();

  try {
    const queryText = `SELECT * FROM quad_users ORDER BY id ASC`;
    const res = await client.query(queryText);
    //console.log("Data retrieved successfully: ", res.rows);
    return res.rows;
  } catch (err) {
    console.error("Error retrieving data:", err);
  } finally {
    client.release();
  }
}

async function getUsersByRewarded() {
  const client = await pool.connect();
  const limit = parseInt(process.env.USER_BATCH_SIZE, 10);
  try {
    const queryText = `SELECT * FROM quad_users WHERE rewarded = false ORDER BY id ASC LIMIT ${limit};`;
    const res = await client.query(queryText);
    //console.log("Data retrieved successfully: ", res.rows);
    return res.rows;
  } catch (err) {
    console.error("Error retrieving data:", err);
  } finally {
    client.release();
  }
}

async function createUsersTable() {
  const client = await pool.connect();
  try {
    const queryText = `
            CREATE TABLE IF NOT EXISTS quad_users (
                id SERIAL,
                wallet_address CHAR(42) PRIMARY KEY,
                reward_pool INTEGER NOT NULL,
                rewarded BOOLEAN,
                reward_balance DECIMAL(28,18)
            );
        `;
    await client.query(queryText);
    console.log("Table quad_users created successfully.");
  } catch (err) {
    console.error("Error creating table quad_users:", err);
  } finally {
    client.release();
  }
}

async function insertTestUsersData() {
  console.log("Inserting users");
  const client = await pool.connect();

  try {
    // Read and parse the JSON data from the file
    const rawData = fs.readFileSync("test-user-data.json");
    const users = JSON.parse(rawData);

    for (const user of users) {
      const queryText = `
        INSERT INTO quad_users (wallet_address, reward_pool, rewarded, reward_balance)
        VALUES ('${user.wallet_address}', ${user.reward_pool}, ${user.rewarded}, ${user.reward_balance});
      `;
      await client.query(queryText);
    }

    console.log("Test data inserted successfully.");
  } catch (err) {
    console.error("Error inserting test data:", err);
  } finally {
    client.release();
  }
}

async function insertUserData(wallet_address, reward_pool) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      "INSERT INTO quad_users (wallet_address, reward_pool,rewarded,reward_balance) VALUES ($1, $2, $3,$4)",
      [wallet_address, reward_pool]
    );
    console.log(`User Inserted: ${wallet_address}`);
  } catch (err) {
    console.error(err.message);
  } finally {
    client.release();
  }
}

async function updateUserData(wallet_address, reward_pool) {
  try {
    const result = await pool.query(
      "UPDATE quad_users SET reward_pool = $1 WHERE wallet_address = $2",
      [reward_pool, wallet_address]
    );
    // console.log(`User Updated: ${wallet_address}`);
  } catch (err) {
    console.error(err.message);
  }
}

async function updateRewarded(wallet_address, rewarded) {
  try {
    const result = await pool.query(
      "UPDATE quad_users SET rewarded = $1 WHERE wallet_address = $2",
      [rewarded, wallet_address]
    );
    //console.log(`User Updated: ${wallet_address}`);
  } catch (err) {
    console.error(err.message);
  }
}

async function updateRewardBalance(wallet_address, reward_balance) {
  try {
    const result = await pool.query(
      "UPDATE quad_users SET reward_balance = $1 WHERE wallet_address = $2",
      [reward_balance, wallet_address]
    );
    // console.log(`User Updated: ${wallet_address}`);
  } catch (err) {
    console.error(err.message);
  }
}

async function getRewardPool(walletAddress) {
  try {
    const query =
      "SELECT reward_pool FROM quad_users WHERE wallet_address = $1";
    const values = [walletAddress];

    // pool.query sends a query to the database and returns the result
    const result = await pool.query(query, values);

    if (result.rows.length > 0) {
      return result.rows[0].reward_pool;
    } else {
      throw new Error(`No user found with wallet address: ${walletAddress}`);
    }
  } catch (err) {
    console.error(err.message);
  }
}

module.exports = {
  createUsersTable,
  insertTestUsersData,
  getUsers,
  insertUserData,
  updateUserData,
  getRewardPool,
  updateRewarded,
  updateRewardBalance,
  dropUsersTable,
  getUsersByRewarded,
};
