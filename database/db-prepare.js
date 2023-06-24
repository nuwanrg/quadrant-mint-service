require("dotenv").config(); // loads variables from .env into process.env
const logger = require("../logger");
// const { deleteTables } = require("./clean-db");
const {
  createUsersTable,
  insertTestUsersData,
  dropUsersTable,
} = require("./users");
const { createNftsTable, dropNftsTable } = require("./nfts");

async function prepareDB() {
  logger.info("Preparing Database!");
  await dropUsersTable();
  await dropNftsTable();
  await createUsersTable();
  await createNftsTable();
  await insertTestUsersData();
  // //Insert test data into quad_users table.
  // try {
  //   console.log("Creating nft table.");
  //   const res = await insertTestUsersData();
  // } catch (err) {
  //   console.error("Error creating table nfts:", err);
  // } finally {
  // }
}

module.exports = {
  prepareDB,
};
