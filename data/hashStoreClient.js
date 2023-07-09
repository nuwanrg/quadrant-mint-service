require("dotenv").config();
const ethers = require("ethers");
const generateHash = require("./hashGenerator.js"); // path to hashGenerator.js file

// let provider = new ethers.providers.InfuraProvider('mainnet', '<INFURA_PROJECT_ID>');
//let privateKey = '<PRIVATE_KEY>';
//let wallet = new ethers.Wallet(privateKey, provider);
// let contractAddress = '<CONTRACT_ADDRESS>';
let contractABI = [
  "function storeHash(bytes32, string) public",
  "function retrieveHashes() public view returns ((bytes32,uint256,string)[])",
];

const contractAddress = process.env.DATA_HASH_CONTRACT;
// const tokenContractAddress = process.env.QUAD_TOKEN_CONTRACT_ADDRESS;
// const contractAbi = fs.readFileSync("mint/abi.json").toString();
const QUICKNODE_HTTP_ENDPOINT = process.env.QUICKNODE_HTTP_ENDPOINT;

let privateKey = process.env.METAMASK_PRIVATEKEY;

//Create provider
let provider = new ethers.providers.JsonRpcProvider(QUICKNODE_HTTP_ENDPOINT);

//create wallet
console.log(privateKey);
let wallet = new ethers.Wallet(privateKey, provider);

let contract = new ethers.Contract(contractAddress, contractABI, wallet);

let dataToHash = {
  name: "John Doe",
  age: 32,
  city: "New York",
}; // your JSON object
let identifier = "your-identifier"; // identifier for the data

async function storeHash() {
  // Generate the hash and convert it to bytes32 format
  let hashToStore = "0x" + generateHash(dataToHash);

  // Send a transaction to store the hash
  let tx = await contract.storeHash(hashToStore, identifier);

  // Wait for the transaction to be mined
  await tx.wait();

  console.log("Hash stored successfully");
}

storeHash().catch(console.error);
