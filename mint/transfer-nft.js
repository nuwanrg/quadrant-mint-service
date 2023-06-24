const ethers = require("ethers");

async function transferNFT(
  privateKey,
  contractAddress,
  tokenId,
  recipientAddress,
  providerURL
) {
  try {
    // Create a new instance of ethers.Wallet with the private key
    // Connect the wallet to the Ethereum network
    const wallet = new ethers.Wallet(
      privateKey,
      new ethers.providers.JsonRpcProvider(providerURL)
    );

    // Define the contract ABI (Application Binary Interface)
    // The ABI is a JSON array containing the contract's function and event specifications
    // Replace this with the actual ABI of your contract
    const contractABI = [
      // ERC721 transfer function
      "function transferFrom(address from, address to, uint256 tokenId) public",
    ];

    // Create a new instance of the ethers.Contract with the contract address and ABI
    const contract = new ethers.Contract(contractAddress, contractABI, wallet);

    // Call the contract's `transferFrom` function
    const tx = await contract.transferFrom(
      wallet.address,
      recipientAddress,
      tokenId
    );

    // Wait for the transaction to be mined
    const receipt = await tx.wait();

    // Return the transaction receipt
    return ["Success", receipt.transactionHash];
  } catch (error) {
    console.log("Error in Transferring NFT to, ");
    return ["Error", tx];
  }
}

module.exports = transferNFT;

//local test
// transferNFT(
//   "f072a46c2b6a21ac8167e76f2198fc7a01814b4d93a03c960562d20dda0635b2",
//   "0x0756a62034fDbFbD30394DAB44d9309EC0c62D8C",
//   1,
//   "0x0B3d07B26D2e5E1d0c2696d0E13d26BFD7344579",
//   "https://young-bold-dust.matic-testnet.discover.quiknode.pro/a0b7aac49cb2c5b052bbed5a16c448c11d18a47a/"
// );
