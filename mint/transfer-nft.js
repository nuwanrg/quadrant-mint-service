const ethers = require("ethers");
const logger = require("../logger");

/**
 * Initiates the transfer of a specified NFT from the wallet associated with the given privateKey to a recipient's address, and returns the transaction status and hash.
 */
async function transferNFT(
  privateKey,
  contractAddress,
  tokenId,
  recipientAddress,
  providerURL
) {
  let nft_transfer_status = "";
  let nft_transfer_hash = "";
  let tx;
  let nftTransferReceipt;
  try {
    // Create a new instance of ethers.Wallet with the private key
    // Connect the wallet to the Ethereum network
    const wallet = new ethers.Wallet(
      privateKey,
      new ethers.providers.JsonRpcProvider(providerURL)
    );

    // Define the contract ABI (Application Binary Interface)
    // The ABI is a JSON array containing the contract's function and event specifications
    const contractABI = [
      // ERC721 transfer function
      "function transferFrom(address from, address to, uint256 tokenId) public",
    ];

    // Create a new instance of the ethers.Contract with the contract address and ABI
    const contract = new ethers.Contract(contractAddress, contractABI, wallet);

    // Call the contract's `transferFrom` function
    tx = await contract.transferFrom(wallet.address, recipientAddress, tokenId);
    logger.info("Test");

    // Get transaction hash
    nft_transfer_hash = tx.hash;

    try {
      // Wait for the transaction to be mined
      nftTransferReceipt = await tx.wait();
      nft_transfer_status = nftTransferReceipt.status ? "Success" : "Failed";
      logger.debug("NFT Transfer Tnx Status: " + nft_transfer_status);
    } catch (error) {
      logger.error("Error while waiting for transaction receipt: " + error);
      nft_transfer_status = "Failed";
    }
  } catch (error) {
    logger.error("Error in Transferring NFT..." + error);
    nft_transfer_status = "Failed";
  }

  logger.debug(
    "nftTransferReceipt: " + JSON.stringify(nftTransferReceipt, null, 2)
  );

  // Return the transaction receipt
  return [nft_transfer_status, nft_transfer_hash];
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
