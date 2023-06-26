require("dotenv").config(); // loads variables from .env into process.env
const logger = require("../logger");
const { ethers, Signer } = require("ethers");
const fs = require("fs");
const transferNFT = require("./transfer-nft");
const transferTokens = require("../mint/transfer-token");
const { updateRewarded, getUsersByRewarded } = require("../database/users");
const { getRewards } = require("../rewards/reward-calculator");
const { insertNFTData } = require("../database/nfts");
const { uploadJSONToPinata } = require("../ipfs/ipfs-service");
const { prepareDB } = require("../database/db-prepare");

let privateKey = null;
let wallet = null;
let provider = null;
let contractInstance = null;
const contractAddress = process.env.QUAD_NFT_CONTRACT_ADDRESS;
const tokenContractAddress = process.env.QUAD_TOKEN_CONTRACT_ADDRESS;
const contractAbi = fs.readFileSync("mint/abi.json").toString();
const QUICKNODE_HTTP_ENDPOINT = process.env.QUICKNODE_HTTP_ENDPOINT;

//Keep the status of NFT Minting and transferring process
let transfer_status = false;
//Keep the status of coin ransferring process
let coint_transfer_status = false;

//Flat to make sure the file is not initiablized multiple times
let isInitialized = false;

//AWS Packages to access secrets setup in aws
const {
  SecretsManagerClient,
  GetSecretValueCommand,
} = require("@aws-sdk/client-secrets-manager");
const secretsManager = new SecretsManagerClient({ region: "us-east-1" });

/**
 * Calculates and returns the sum of two numbers.
 *
 * @param {string} secretName - AWS secret name
 * @returns {string} The sum of a and b
 */
async function getSecret(secretName) {
  // If running locally, return secret from .env file
  if (process.env.NODE_ENV === "development") {
    return JSON.stringify({
      metamask_privateKey: process.env.METAMASK_PRIVATEKEY,
    });
  }
  const command = new GetSecretValueCommand({ SecretId: secretName });
  const data = await secretsManager.send(command);
  return data.SecretString;
}

/**
 * Init the program with required web3 configuration
 */
async function init() {
  logger.info("Initiablizing Quadrant NFT Minting and Distribution...");
  if (isInitialized) {
    console.log("Already initialized!");
    return;
  }
  logger.info("process.env.NODE_ENV", process.env.NODE_ENV);
  try {
    if (process.env.NODE_ENV === "development") {
      // const preparedb = await prepareDB();
    }
  } catch (err) {
    console.error(err);
  }
  //const initstatus = await init();
  try {
    //Get contract owener's ethereum wallet private key from aws secret.
    const secrets = await getSecret("metamask_privateKey");
    const secretObject = JSON.parse(secrets);
    privateKey = secretObject.metamask_privateKey;

    //Create provider
    provider = new ethers.providers.JsonRpcProvider(QUICKNODE_HTTP_ENDPOINT);

    //create wallet
    wallet = new ethers.Wallet(privateKey, provider);

    //Create NFT Contract
    contractInstance = new ethers.Contract(
      contractAddress,
      contractAbi,
      provider
    );
  } catch (error) {
    logger.error("Error in Initializing", error);
  }
  isInitialized = true;
}

//Get gas price
async function getGasPrice() {
  let feeData = (await provider.getGasPrice()).toNumber();
  return feeData;
}

//Get the nonce
async function getNonce() {
  let nonce = await provider.getTransactionCount(this.wallet.address);
  return nonce;
}

async function _mintNFT() {
  try {
    await init();
    const users = await getUsersByRewarded();
    logger.info("Users batch size : " + users.length);

    for (let user of users) {
      // reset the transfer_status to false before minting the next NFT
      transfer_status = false;
      logger.info(
        "Minting and Distribution for wallet : " + user.wallet_address
      );
      await mintNFT(user.wallet_address, "METADATA_URL");

      // Wait for the mintNFT function to set the transfer_status
      while (!transfer_status) {
        // This delay function will "pause" execution in this loop for a certain amount of time,
        // then continue to the next iteration of the loop. It doesn't block other operations.
        //await delay(60000); // 60000 ms = 60 seconds
        await delay(500); // delay for 500ms
        //console.log("Waiting for the transaction to be completed....");
      }
    }
  } catch (err) {
    console.error("Failed to fetch users:", err);
  }
  //mintNFT("0x16a1842b8ca64EaD5ff24F21aFd54EAe04974eF5", "METADATA_URL");
}

/**
 * Mint a NFT and Distribute send it to the given wallet address along with associated coins(Tokens).
 * @param {string} user_address - The wallet address of the user that the NFT and Coins are to be sent.
 */
async function mintNFT(user_address) {
  //Columsn in nfts table that data will be inserted and updated during minting and distribution process
  let recipient_wallet = user_address;
  let token_uri = "";
  let token_id = "";
  let coin_reward = "";
  let nft_mint_status = "";
  let nft_transfer_status = "";
  let coin_transfer_status = "";
  let nft_mint_hash = "";
  let nft_transfer_hash = "";
  let coin_transfer_hash = "";
  let nft_mint_error = "";
  let nft_transfer_error = "";
  let coin_transfer_error = "";

  try {
    // const nonce = await getNonce();
    // const gasFee = await getGasPrice();

    //Get the coin amout associated with NFT to be rewared.
    coin_reward = await getRewards(user_address);
    logger.info("coinreward " + coin_reward);

    //Get token uri. Coin reward associated with NFT are stored in NFT metadata in token uri.
    token_uri = await uploadJSONToPinata(coin_reward);
    logger.debug("token_uri: " + token_uri);

    //Populate mint transaction. Not required to pass nonce as the program wait until the current mint and distribution is finished.
    //In case current approach is not scalable and distribution transation keep hanging too long, the minting process can keep loop by current nonce.
    //But for the current desing its not required to pass the nonce.
    let rawTxn = await contractInstance.populateTransaction.mint(
      token_uri /*, {
      gasPrice: gasFee,
      nonce: nonce,
    }*/
    );

    logger.info("Submitting mint transaction");
    let signedTxn = await wallet.sendTransaction(rawTxn);
    //get tnx hash of mint
    let mintReceipt = await signedTxn.wait();
    nft_mint_hash = mintReceipt.hash;
    nft_mint_status = mintReceipt.status ? "Success" : "Failed";

    logger.debug("signedTxn: " + JSON.stringify(signedTxn, null, 2));
    logger.debug("mintReceipt: " + JSON.stringify(mintReceipt, null, 2));
    logger.debug("NFT Mint Tnx Status: " + nft_mint_status);
    //console.log("reciept", await signedTxn);
    logger.info("NFT Minted successfully! Transaction Hash:" + nft_mint_hash);

    //Retrive token_id of the mint
    token_id = await contractInstance.tokenCounter();
    // Replace with your actual BigNumber
    //let tokenIdBigNumber = tokenId;
    token_id = token_id.toNumber() - 1; // Converts to JavaScript number - be careful with large values
    // token_id = tokenIdNumber;

    logger.debug("token_id: " + token_id);

    //Tranfer the NFT to user's wallet
    const [nft_transfer_status, nft_transfer_hash] = await transferNFT(
      privateKey,
      contractAddress,
      token_id,
      user_address,
      QUICKNODE_HTTP_ENDPOINT
    );

    logger.info(
      "NFT Transfered successfully! Transaction Hash:" + nft_transfer_hash
    );

    //Transfe coin to users wallet
    const [coin_transfer_status, coin_transfer_hash] = await transferTokens(
      tokenContractAddress,
      privateKey,
      user_address,
      coin_reward
    );

    logger.info(
      "Tokens Transfered successfully! Transaction Hash:" + coin_transfer_hash
    );

    // Update reward balance
    // if (coin_transfer_status == "Success") {
    // updateRewardBalance(recipient_wallet, true);

    //if both nft and coin transfer is successfull update the user as rewarded.
    if (coin_transfer_status == "Success" && nft_transfer_status == "Success") {
      updateRewarded(recipient_wallet, true);

      //This flag is used in the main user iteration. True means program goes to next distribution cycle.
      transfer_status = true;
    }

    //Insert data into nfts table
    await insertNFTData(
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
    );
    logger.info(
      "Minting and Coin Distribution Successful for wallet : " +
        recipient_wallet +
        "\n"
    );
  } catch (e) {
    //in an event of error in any of mint, nft transfer and coin transfer steps , add records in to nfts table.
    await insertNFTData(
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
    );
    logger.error("Error Caught in Minting... : ", e);
  }
}

function delay(t, v) {
  return new Promise(function (resolve) {
    setTimeout(resolve.bind(null, v), t);
  });
}

module.exports = { _mintNFT, mintNFT };
