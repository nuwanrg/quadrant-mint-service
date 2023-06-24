const { uploadJSONToPinata } = require("../ipfs/ipfs-service");

async function main() {
  try {
    const response = await uploadJSONToPinata("1");
    const tokenURI = response;
    console.log(tokenURI);
  } catch (err) {
    console.error(err);
  }
}

main();
