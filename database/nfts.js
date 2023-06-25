const pool = require("./db");

async function dropNftsTable() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const queryText = `DROP TABLE IF EXISTS nfts CASCADE`;
    const res = await client.query(queryText);
    const commit = await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error dropping table:", err);
  } finally {
    client.release();
  }
}

async function createNftsTable() {
  const client = await pool.connect();

  try {
    const queryText = `
            CREATE TABLE IF NOT EXISTS nfts (
                id SERIAL PRIMARY KEY,
                recipient_wallet VARCHAR(42) REFERENCES quad_users(wallet_address),
                coin_reward DECIMAL(28,18),
                nft_mint_status VARCHAR(255),
                token_uri VARCHAR(255),
                token_id VARCHAR(255),
                nft_mint_hash VARCHAR(255),
                nft_transfer_status VARCHAR(255),
                nft_transfer_hash VARCHAR(255),
                coin_transfer_status VARCHAR(255),
                coin_transfer_hash VARCHAR(255),
                nft_mint_error TEXT,
                nft_transfer_error TEXT,
                coin_transfer_error TEXT
            );
        `;
    await client.query(queryText);
    console.log("Table nfts created successfully.");
  } catch (err) {
    console.error("Error creating nfts table:", err);
  } finally {
    client.release();
  }
}

async function getNfts() {
  const client = await pool.connect();

  try {
    const queryText = `
            SELECT * FROM nfts;
        `;
    const res = await client.query(queryText);
    console.log("Data retrieved successfully: ", res.rows);
  } catch (err) {
    console.error("Error retrieving data:", err);
  } finally {
    client.release();
  }
}

async function insertNftsTestData() {
  const client = await pool.connect();

  try {
    const queryText = `
            INSERT INTO nfts (recipient_wallet, token_uri, coin_reward, nft_transfer_status, coin_transfer_status, nft_txn_hash, coin_txn_hash)
            VALUES ('0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B', 'my_token_uri_1', 100, true, false, 'nft_hash_1', 'coin_hash_1'),
                   ('0x4E83362442B8d1beC281594CEA3050c8EB01311C', 'my_token_uri_2', 200, true, true, 'nft_hash_2', 'coin_hash_2'),
                   ('0xCA22C6dF116eB6B14bFa6a8c80C43b0c1D3e3284', 'my_token_uri_3', 300, false, true, 'nft_hash_3', 'coin_hash_3');
        `;
    await client.query(queryText);
    console.log("Test data inserted successfully.");
  } catch (err) {
    console.error("Error inserting test data:", err);
  } finally {
    client.release();
  }
}

async function insertNFTData(
  recipient_wallet,
  token_uri,
  token_id,
  coin_reward,
  nft_mint_status,
  nft_transfer_status,
  coin_transfer_status,
  nft_mint_hash,
  nft_transfer_hash,
  coin_transfer_hash,
  nft_mint_error,
  nft_transfer_error,
  coin_transfer_error
) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      "INSERT INTO nfts (recipient_wallet,token_uri,token_id,coin_reward,nft_mint_status,nft_transfer_status, coin_transfer_status,nft_mint_hash,nft_transfer_hash,coin_transfer_hash,nft_mint_error,nft_transfer_error,coin_transfer_error) VALUES ($1, $2, $3, $4, $5, $6, $7,$8, $9, $10, $11,$12, $13)",
      [
        recipient_wallet,
        token_uri,
        token_id,
        coin_reward,
        nft_mint_status,
        nft_transfer_status,
        coin_transfer_status,
        nft_mint_hash,
        nft_transfer_hash,
        coin_transfer_hash,
        nft_mint_error,
        nft_transfer_error,
        coin_transfer_error,
      ]
    );
    // console.log(`NFT Inserted for: ${recipient_wallet}`);
  } catch (err) {
    console.error(err.message);
  } finally {
    client.release();
  }
}

async function updateNFTData(
  recipient_wallet,
  nft_transfer_status,
  coin_transfer_status,
  nft_txn_hash,
  coin_txn_hash
) {
  try {
    const result = await pool.query(
      "UPDATE nfts SET nft_transfer_status = $1, coin_transfer_status = $2, nft_txn_hash = $3, coin_txn_hash = $4 WHERE recipient_wallet = $5",
      [
        nft_transfer_status,
        coin_transfer_status,
        nft_txn_hash,
        coin_txn_hash,
        recipient_wallet,
      ]
    );
    console.log(`NFT Updated for: ${recipient_wallet}`);
  } catch (err) {
    console.error(err.message);
  } finally {
    client.release();
  }
}

async function getNftsByWallet(walletAddress) {
  try {
    const query = "SELECT token_uri FROM nfts WHERE recipient_wallet = $1";
    const values = [walletAddress];

    // pool.query sends a query to the database and returns the result
    const result = await pool.query(query, values);

    const token = [];

    if (result.rows.length > 0) {
      return result.rows[0].reward_pool;
    } else {
      throw new Error(`No user found with wallet address: ${walletAddress}`);
    }
  } catch (err) {
    console.error(err.message);
  } finally {
    client.release();
  }
}

module.exports = {
  createNftsTable,
  insertNftsTestData,
  getNfts,
  insertNFTData,
  updateNFTData,
  dropNftsTable,
};
