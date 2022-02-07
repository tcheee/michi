const main = async () => {
  const nftContractReward = await hre.ethers.getContractFactory('CourseReward');
  const nftContract = await nftContractReward.deploy();
  await nftContract.deployed();
  console.log("Contract deployed to:", nftContract.address);

  const _add = '0xe0341C8de6d39394f733b9F4e11751781a1069eE'

  let txn = await nftContract.safeMint(_add, "https://ipfs.io/ipfs/QmecQECahGuY9tXCTcDd7nPKBPYjQo63M4K2YxveCLQVDz")
  // Wait for it to be mined.
  const receipt = await txn.wait()

  const event = receipt.events

  console.log("Contract created", txn)
  console.log("events ====> ", event)

};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();