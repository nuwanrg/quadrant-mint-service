const CryptoJS = require("crypto-js");

function generateHash(data) {
  let json = JSON.stringify(data);
  let hash = CryptoJS.SHA256(json);
  return hash.toString(CryptoJS.enc.Hex);
}

// Assuming your JSON data is something like this
const data = {
  name: "John Doe",
  age: 32,
  city: "New York",
};

module.exports = generateHash;

// const hash = generateHash(data);
// console.log("The SHA-256 hash of the JSON data is: ", hash);
