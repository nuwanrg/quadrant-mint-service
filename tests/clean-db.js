const pool = require("../database/db.js");
async function deleteTables() {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const dropNFTsTableQuery = `DROP TABLE IF EXISTS nfts`;
    await client.query(dropNFTsTableQuery);

    // const dropUsersTableQuery = `DROP TABLE IF EXISTS quad_users`;
    // await client.query(dropUsersTableQuery);

    await client.query("COMMIT");

    console.log("Tables deleted successfully.");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error deleting tables:", error);
  } finally {
    client.release();
  }
}

deleteTables();
