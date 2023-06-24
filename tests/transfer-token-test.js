require("dotenv").config(); // loads variables from .env into process.env
const transferTokens = require("../mint/transfer-token");
const {
  SecretsManagerClient,
  GetSecretValueCommand,
} = require("@aws-sdk/client-secrets-manager");
const secretsManager = new SecretsManagerClient({ region: "us-east-1" });
const contractAddress = process.env.QUAD_TOKEN_CONTRACT_ADDRESS;

async function getSecret(secretName) {
  console.log("getSecret called");
  const command = new GetSecretValueCommand({ SecretId: secretName });
  const data = await secretsManager.send(command);
  return data.SecretString;
}

(async () => {
  try {
    const secrets = await getSecret("metamask_privateKey");
    const secretObject = JSON.parse(secrets);
    const privateKey = secretObject.metamask_privateKey;
    const recipient = "0x5Ab14c7F5d7d97bd85d66e186d6b79941655BDa0";
    const amount = 100; // the amount of tokens you want to send

    await transferTokens(contractAddress, privateKey, recipient, amount);
  } catch (error) {
    console.error(error);
  }
})();
