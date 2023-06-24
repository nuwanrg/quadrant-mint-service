require("dotenv").config(); // loads variables from .env into process.env
const { createUsersTable, insertTestUsersData } = require("./users");
const { createNftsTable } = require("./nfts");

if (process.env.PREPARE_DB) {
  try {
    console.log("Creating users table.");
    createUsersTable();
  } catch (err) {
    console.error("Error creating table quad_users:", err);
  } finally {
    //client.release();
  }

  try {
    console.log("Creating nft table.");
    createNftsTable();
  } catch (err) {
    console.error("Error creating table nfts:", err);
  } finally {
    //client.release();
  }

  //Insert test data into quad_users table.
  //insertTestUsersData();
}
