const axios = require("axios");
const FormData = require("form-data");

async function uploadJSONToPinata(coinreward) {
  console.log("coinreward", coinreward);
  // convert JSON object to JSON string and then to Buffer
  let jsonData = await getJsonMetadata(coinreward);
  const jsonBuffer = Buffer.from(JSON.stringify(jsonData));

  // create a new instance of FormData
  const formData = new FormData();

  // append the buffer as a file to the formData
  formData.append("file", jsonBuffer, { filename: "metadata.json" });

  try {
    const response = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        maxBodyLength: "Infinity", // this is needed to prevent axios HTTP client from erroring out when sending large payloads
        headers: {
          "Content-Type": `multipart/form-data; boundary=${formData._boundary}`, // this extra header is required for axios to properly send formData

          pinata_api_key: "d4ddb157581ac1bbad15",
          pinata_secret_api_key:
            "a55e25e226351ba850ba0aa01c4a28e848afa1b182e9477011d1c55e2f4046eb",
        },
      }
    );

    //console.log(response);

    const tokenURI =
      "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash;
    return tokenURI;
  } catch (error) {
    console.error("Error uploading file: ", error);
  }
}

async function getJsonMetadata(coinreward) {
  // Your dynamic data
  let name = "Quad Reward NFT";
  let description = "This is a rewad NFT from Quadrant!";
  let image =
    "https://ipfs.io/ipfs/QmUJNomP7E7cgNCna6kaZKYguTrYQkSvWdC7XoLELqpsiV";
  //let coinreward = coinreward;

  // Create the metadata object
  let metadata = {
    name: name,
    description: description,
    image: image,
    attributes: [
      {
        trait_type: "coinreward",
        value: coinreward,
      },
    ],
  };
  return metadata;
  //let metadataJSON = JSON.stringify(metadata);
  //uploadJSONToPinata(1);
  //   return metadataJSON;
}

module.exports = { uploadJSONToPinata };
