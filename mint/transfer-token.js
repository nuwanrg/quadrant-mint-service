const ethers = require("ethers");
const logger = require("../logger");
const { updateRewardBalance } = require("../database/users");
const QUICKNODE_HTTP_ENDPOINT = process.env.QUICKNODE_HTTP_ENDPOINT;

async function transferTokens(contractAddress, privateKey, recipient, amount) {
  let transfer_status = "";
  let transfer_hash = "Failed";
  let coin_transfer_nonce;
  let coin_transfer_error;

  try {
    const provider = new ethers.providers.JsonRpcProvider(
      QUICKNODE_HTTP_ENDPOINT
    );
    const wallet = new ethers.Wallet(privateKey, provider);

    const erc20Abi = [
      "function name() view returns (string)",
      "function symbol() view returns (string)",
      "function balanceOf(address owner) view returns (uint)",
      "function transfer(address to, uint amount)",
      "event Transfer(address indexed from, address indexed to, uint amount)",
    ];

    const contract = new ethers.Contract(contractAddress, erc20Abi, wallet);

    const decimals = 18;
    const adjustedAmount = ethers.utils.parseUnits(amount.toString(), decimals);

    let tx = await contract.transfer(recipient, adjustedAmount);
    logger.info("Token Transfer Transaction Submitted");
    transfer_hash = tx.hash;
    coin_transfer_nonce = tx.nonce;
    logger.debug(`coin_transfer_hash:  ${transfer_hash}`);
    logger.debug(`coin_transfer_nonce:  ${coin_transfer_nonce}`);

    const receipt = await tx.wait();
    logger.debug("Coin Tranfer Receipt: " + JSON.stringify(receipt, null, 2));

    transfer_status = receipt.status ? "Success" : "Failed";
    logger.debug("Coin Transfer Transaction Status: " + transfer_status);

    const balance = await contract.balanceOf(recipient);
    const adjustedBalance = ethers.utils.formatUnits(balance, decimals);
    const updateReward = updateRewardBalance(recipient, adjustedBalance);
  } catch (error) {
    logger.error("Error in Transferring Coins..." + error);
    coin_transfer_error = error.toString();
  }

  return [transfer_status, transfer_hash, coin_transfer_nonce];
}

module.exports = transferTokens;
