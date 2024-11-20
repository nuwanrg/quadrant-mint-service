# A Seamless NFT Minting and Distribution Platform

## Overview

QuadNFT is a powerful platform conceived to revolutionize the process of minting Non-Fungible Tokens (NFTs) and distributing them, accompanied by QUAD Tokens as associated rewards, directly into the wallets of users.

The operation of this system is as follows:

User data, including the reward pool they belong to, is retrieved from a PostgreSQL database and processed through a main loop.

For each user, a customized reward amount is dynamically calculated at the time of minting based on specific reward criteria, ensuring a fair and adaptable distribution process.

An NFT, branded as QuadNFT, is minted with a unique token URI, which contains the calculated QUAD Token reward details. This data is securely stored on the InterPlanetary File System (IPFS) through the Pinata service.

The minting process unfolds on the Ethereum network, utilizing smart contracts developed with the Hardhat framework. These smart contracts, extending from OpenZeppelin's secure and reliable ERC721 and ERC20 standards, power the creation of QuadNFTs and QUAD Tokens.

Once the QuadNFT is minted, it's immediately transferred to the user's wallet. Simultaneously, the calculated QUAD Token reward is transferred to the same wallet.

This synchronized process is handled within an AWS Lambda function, ensuring excellent scalability, manageability, and security. By integrating the minting and transfer steps within the same function, the design circumvents potential transaction failures due to nonce inconsistencies.

Specialized RPC Provider Usage: The solution leverages two Ethereum RPC providers tailored to their strengths: QuickNode for minting and transferring the QuadNFT and QUAD tokens, and Infura for the Dash application to retrieve QUAD token balances. This dual usage ensures optimal performance in each process, taking advantage of QuickNode's speed and reliability for transaction-intensive tasks, and Infura's consistency and accessibility for balance retrievals.

Complementing the system is an intuitive dashboard built with the Python Dash framework. This dashboard retrieves and visualizes data from the PostgreSQL database, providing a comprehensive overview of the QuadNFT distribution.

The solution is architected around three distinct code repositories: the smart contracts implementation, the Lambda function, and the Dash dashboard, fostering modularity and maintainability.
