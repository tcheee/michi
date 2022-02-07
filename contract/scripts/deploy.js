const main = async () => {
  const nftContractFactory = await hre.ethers.getContractFactory('CourseFactory');
  const nftContract = await nftContractFactory.deploy();
  await nftContract.deployed();
  console.log("Contract deployed to:", nftContract.address);

  // let txn = await nftContract.createLesson(10, "https://ipfs.io/ipfs/QmecQECahGuY9tXCTcDd7nPKBPYjQo63M4K2YxveCLQVDz")
  // // Wait for it to be mined.
  // const receipt = await txn.wait()

  // const event = receipt.events

  // console.log("Lesson created", txn)
  // console.log("address of the new contract created ====>", event[0].address)

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