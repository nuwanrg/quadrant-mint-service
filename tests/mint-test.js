const { _mintNFT, mintNFT } = require("../mint/mint");

(async () => {
  try {
    //const res = await mintNFT("0x092343BfdEFf5D006b13F459D3a5f7f0c1a93E29");
    await _mintNFT();
  } catch (err) {
    console.error(err);
  }
})();
