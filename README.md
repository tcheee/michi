# michi
A decentralize courses marketplace on Polygon using IPFS.

![alt text](https://i.imgur.com/pXbwdwa.png)

Michi is a web app built with React and Solidity.

As a user, you can connect to the app with your wallet, you can access all the courses available on the marketplace. You don't need to connect your wallet to see the content of the marketplace as we use a web3 provider to fetch the data for non logged-in users. To access a course you will need to purchase a NFT of the course. The content of a course is encrypted, to decrypt it you need to have the NFT of the course. Finally, when you finish the course you will be able to mint a non-transferable ERC721 token to show that you follow the course.

As a creator, you can connect your wallet and create a course including a video and rich text content. At the creation, your content will be encrypted thanks to Cryptojs and uploaded on IPFS thanks to Pinata. When a course is created it will call our smart contract, and it creates a custom ERC1155 smart contract for your course with two tokens: one non-fungible token giving ownership (and money) for the creator that can be transfered and one fungible token that can be minted for a defined amount that can't be transfered. 

All our smart contracts are hosted on the Polygon blockchain. We mainly use Moralis to access the metadata of the course and display the NFT. 
