require("dotenv").config(); // loads variables from .env into process.env
const logger = require("../logger");
const {
  createUsersTable,
  insertTestUsersData,
  dropUsersTable,
} = require("./users");
const { createNftsTable, dropNftsTable } = require("./nfts");

/*
 *Drop and created tables. This function should not be used in a production env.
 */
async function prepareDB() {
  logger.info("Preparing Database!");
  await dropUsersTable();
  await dropNftsTable();
  await createUsersTable();
  await createNftsTable();
  await insertTestUsersData();
}

module.exports = {
  prepareDB,
};
