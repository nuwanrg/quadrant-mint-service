const pool = require("../database/db");

const {
  createNftsTable,
  insertNftsTestData,
  getNfts,
  insertNFTData,
  updateNFTData,
} = require("../database/nfts");

// Call the functions
//insertTestUsersData();

// const res = await getUsers();
// console.log("users ", res);

getNfts().then((res) => {
  console.log(res); // Outputs: "Completed!"
});

// insertUserData("wallet_address_here", 1000);
// updateUserData("wallet_address_here", 2000);
