const pool = require("../database/db");

//Returns reward amount to be distributed for a given wallet
async function getRewards(walletAddress) {
  try {
    const query =
      "SELECT reward_pool FROM quad_users WHERE wallet_address = $1";
    const values = [walletAddress];

    // pool.query sends a query to the database and returns the result
    const result = await pool.query(query, values);

    if (result.rows.length > 0) {
      //Implement the logic for calculating rewards
      const rewardPool = result.rows[0].reward_pool;
      // console.log("rewardPool " + rewardPool);
      let rewards = 1; //Set default 1 in case a wallet if not belong to any pool.

      if (rewardPool == 1) {
        rewards = 10;
      } else if (rewardPool == 2) {
        rewards = 20;
      } else if (rewardPool == 3) {
        rewards = 30;
      } else if (rewardPool == 4) {
        rewards = 40;
      }
      return rewards;
    } else {
      throw new Error(`No user found with wallet address: ${walletAddress}`);
    }
  } catch (err) {
    console.error(err.message);
  }
}

module.exports = {
  getRewards,
};
