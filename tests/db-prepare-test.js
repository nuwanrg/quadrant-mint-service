const { logger } = require("ethers");
const pool = require("../database/db");

const { prepareDB } = require("../database/db-prepare");

(async () => {
  try {
    logger.info("Testdb prepare");
    const res = await prepareDB();
  } catch (err) {
    console.error(err);
  }
})();
