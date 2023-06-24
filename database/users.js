// users.js

const pool = require("./db");

// const getUsers = () => {
//   return new Promise((resolve, reject) => {
//     pool.query("SELECT * FROM quad_users", (err, res) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(res.rows);
//       }
//     });
//   });
// };

async function dropUsersTable() {
  const client = await pool.connect();
  try {
    const queryText = `DROP TABLE IF EXISTS quad_users CASCADE`;
    const res = await client.query(queryText);
    const commit = await client.query("COMMIT");
    return "Tabel quad_users droped successfully";
  } catch (err) {
    console.error("Error dropping table:", err);
  } finally {
    client.release();
  }
}

async function getUsers() {
  const client = await pool.connect();

  try {
    const queryText = `SELECT * FROM quad_users`;
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
  const client = await pool.connect();

  try {
    const queryText = `
            INSERT INTO quad_users (wallet_address, reward_pool, rewarded, reward_balance)
            VALUES ('0x0B3d07B26D2e5E1d0c2696d0E13d26BFD7344579', 1, false,0),
                   ('0x020D13a97dE3a1BcE11956fb974A2fFE216f72A1', 2, false,0),
                   ('0x70997970C51812dc3A010C7d01b50e0d17dc79C8', 3, false,0),
                   ('0x164ECceAA3f69AC4fA1852549299B387D3bC0A33', 1, false,0),
                   ('0x3b09cd199665c16530a862A88fE7F41a2e4d2586', 2, false,0),
                   ('0x5AB7E80D46B87be813Bc0FacA13cbce5156Ff04f', 3, false,0),
                   ('0x9876EedD18BB8aBa5aFfa21e6A14B8553A0F47cD', 1, false,0),
                   ('0x9FCb2BebB9204851545d6F843cc664d39C7E5594', 2, false,0),
                   ('0x5Ab14c7F5d7d97bd85d66e186d6b79941655BDa0', 3, false,0),
                   ('0x8287Cf0b8F02d7A6248D76D281016cDdc21Db037', 1, false,0)
                   ;
        `;
    await client.query(queryText);
    console.log("Test data inserted successfully.");
  } catch (err) {
    console.error("Error inserting test data:", err);
  } finally {
    client.release();
  }
}

async function insertUserData(wallet_address, reward_pool) {
  try {
    const result = await pool.query(
      "INSERT INTO quad_users (wallet_address, reward_pool,rewarded,reward_balance) VALUES ($1, $2, $3,$4)",
      [wallet_address, reward_pool]
    );
    console.log(`User Inserted: ${wallet_address}`);
  } catch (err) {
    console.error(err.message);
  }
}

async function updateUserData(wallet_address, reward_pool) {
  try {
    const result = await pool.query(
      "UPDATE quad_users SET reward_pool = $1 WHERE wallet_address = $2",
      [reward_pool, wallet_address]
    );
    console.log(`User Updated: ${wallet_address}`);
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
    console.log(`User Updated: ${wallet_address}`);
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
    console.log(`User Updated: ${wallet_address}`);
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
};
