const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Test for the Course Reward Contract', function () {
  let rewardContract;
  before(async function () {
    const RewardContract = await ethers.getContractFactory('CourseReward');
    rewardContract = await RewardContract.deploy();
    await rewardContract.deployed();
  });

  it('Should create new NFT to reward the user for a specific lesson', async function () {
    const ipfsFakeURL = 'https://ipfs.io/ipfs/FakeURL';
    const [, addr1] = await ethers.getSigners();

    const mintTxn = await rewardContract.safeMint(addr1.address, ipfsFakeURL);
    await mintTxn.wait();

    let addr1Balance = await rewardContract.balanceOf(addr1.address);
    addr1Balance =
      parseFloat(ethers.utils.formatEther(addr1Balance)) * 10 ** 18;

    expect(addr1Balance).to.equal(1);
  });

  it('Should be impossible to transfer to another address using transferFrom', async function () {
    const [, addr1, addr2] = await ethers.getSigners();

    await expect(
      rewardContract.transferFrom(addr1.address, addr2.address, 1)
    ).to.be.revertedWith(
      "reverted with reason string 'You can not transfer this NFT.'"
    );
  });

  //   it('Should be impossible to transfer to another address using safeTransferFrom', async function () {
  //     const [owner, addr1, addr2] = await ethers.getSigners();

  //     console.log(rewardContract);

  //     const rewardtxn = await rewardContract.safeTransferFrom(
  //       addr1.address,
  //       addr2.address,
  //       1
  //     );
  //     rewardtxn.wait();

  //     // await expect(
  //     //   rewardContract.safeTransferFrom(addr1.address, addr2.address, 1, 'test')
  //     // ).to.be.revertedWith(
  //     //   "reverted with reason string 'You can not transfer this NFT.'"
  //     // );
  //   });
});
