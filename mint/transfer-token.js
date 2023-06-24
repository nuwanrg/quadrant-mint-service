const ethers = require("ethers");
const { updateRewardBalance } = require("../database/users");
const QUICKNODE_HTTP_ENDPOINT = process.env.QUICKNODE_HTTP_ENDPOINT;

async function transferTokens(contractAddress, privateKey, recipient, amount) {
  try {
    const provider = new ethers.providers.JsonRpcProvider(
      QUICKNODE_HTTP_ENDPOINT
    );

    const wallet = new ethers.Wallet(privateKey, provider);

    // The ABI for ERC20 Transfer function
    const erc20Abi = [
      // Some details about the token
      "function name() view returns (string)",
      "function symbol() view returns (string)",

      // Get the account balance
      "function balanceOf(address owner) view returns (uint)",

      // Send some of your tokens to someone else
      "function transfer(address to, uint amount)",

      // An event triggered whenever anyone transfers to someone else
      "event Transfer(address indexed from, address indexed to, uint amount)",
    ];

    const contract = new ethers.Contract(contractAddress, erc20Abi, wallet);

    // The number of decimal places the token can be divided into
    //   const decimals = await contract.decimals();
    const decimals = 18;

    // Adjust the token amount based on the number of decimal places
    const adjustedAmount = ethers.utils.parseUnits(amount.toString(), decimals);

    // Transfer the tokens
    const tx = await contract.transfer(recipient, adjustedAmount);

    // Wait for the transaction to be mined
    const receipt = await tx.wait();
    //console.log("Transaction hash:", receipt.transactionHash);

    //Update token_balance of users
    const balance = await contract.balanceOf(recipient);
    const adjustedBalance = ethers.utils.formatUnits(balance, decimals);
    const updateReward = updateRewardBalance(recipient, adjustedBalance);

    return ["Success", receipt.transactionHash];
  } catch (error) {
    console.log("Error in Transferring Tokens to, ");
    return ["Error", receipt];
  }
}

module.exports = transferTokens;
