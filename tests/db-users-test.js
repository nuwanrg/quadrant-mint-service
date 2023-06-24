const { logger } = require("ethers");
const pool = require("../database/db");

const {
  insertUserData,
  updateUserData,
  getUsers,
  insertTestUsersData,
  dropUsersTable,
} = require("../database/users");

//Drope table
// (async () => {
//   try {
//     logger.info("Droping tabel");
//     const droped = await dropUsersTable();
//     logger.info(droped);
//   } catch (err) {
//     console.error(err);
//   }
// })();

// Call the functions
//Drope table
(async () => {
  try {
    logger.info("Insert users test data");
    const res = await insertTestUsersData();
    logger.info(res);
  } catch (err) {
    console.error(err);
  }
})();

// const res = await getUsers();
// console.log("users ", res);

// getUsers().then((res) => {
//   console.log(res); // Outputs: "Completed!"
// });

// insertUserData("wallet_address_here", 1000);
// updateUserData("wallet_address_here", 2000);
