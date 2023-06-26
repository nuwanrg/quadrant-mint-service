const ethers = require("ethers");
const logger = require("../logger");
const { updateRewardBalance } = require("../database/users");
const QUICKNODE_HTTP_ENDPOINT = process.env.QUICKNODE_HTTP_ENDPOINT;

async function transferTokens(contractAddress, privateKey, recipient, amount) {
  let transfer_status = "";
  let transfer_hash = "Failed";

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

    try {
      let tx = await contract.transfer(recipient, adjustedAmount);
      logger.info("Token Transfer Transaction Submitted");
      transfer_hash = tx.hash;

      const receipt = await tx.wait();
      logger.debug("Receipt: " + JSON.stringify(receipt, null, 2));

      transfer_status = receipt.status ? "Success" : "Failed";
      logger.debug("Token Transfer Transaction Status: " + transfer_status);

      const balance = await contract.balanceOf(recipient);
      const adjustedBalance = ethers.utils.formatUnits(balance, decimals);
      const updateReward = updateRewardBalance(recipient, adjustedBalance);
    } catch (txError) {
      logger.error("Error in Token Transfer Transaction..." + txError);
    }
  } catch (error) {
    logger.error("Error in Transferring Tokens..." + error);
  }

  return [transfer_status, transfer_hash];
}

module.exports = transferTokens;
