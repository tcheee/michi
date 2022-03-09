const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Test for the Main Course Contract', function () {
  let courseContract;
  const ipfsFakeURL = 'https://ipfs.io/ipfs/FakeURL';
  const coursePrice = hre.ethers.utils.parseEther('1');
  before(async function () {
    const [owner] = await ethers.getSigners();
    const CourseContract = await ethers.getContractFactory('Course');
    courseContract = await CourseContract.deploy(
      owner.address,
      coursePrice,
      ipfsFakeURL
    );
    await courseContract.deployed();
  });

  it('Should let anyone take the class if they pay the right amount', async function () {
    const [, addr1] = await ethers.getSigners();
    const txn = await courseContract.connect(addr1).takeClass({
      value: hre.ethers.utils.parseEther('1'),
    });
    await txn.wait();

    let balanceAddr = await courseContract
      .connect(addr1)
      .balanceOf(addr1.address, 1);
    balanceAddr = parseFloat(ethers.utils.formatEther(balanceAddr)) * 10 ** 18;

    expect(balanceAddr).to.equal(1);
  });

  it('Should let anyone throw an error if you are trying to take the class without the righ amount', async function () {
    const [, addr1] = await ethers.getSigners();

    await expect(
      courseContract.takeClass({
        value: hre.ethers.utils.parseEther('0'),
      })
    ).to.be.revertedWith('You must provide eth in order to access the class!');
  });

  it('Should let owner withdraw money', async function () {
    const [owner] = await ethers.getSigners();
    const prov = ethers.provider;

    let balanceBefore = await prov.getBalance(owner.address);
    balanceBefore =
      parseFloat(ethers.utils.formatEther(balanceBefore)) * 10 ** 18;
    let balanceContractBefore = await prov.getBalance(courseContract.address);
    balanceContractBefore = hre.ethers.utils.parseEther(
      ethers.utils.formatEther(balanceContractBefore)
    );

    let txn = await courseContract.withDrawMoney(balanceContractBefore);
    await txn.wait();

    let balanceAfter = await prov.getBalance(owner.address);
    balanceAfter =
      parseFloat(ethers.utils.formatEther(balanceAfter)) * 10 ** 18;
    let balanceContractAfter = await prov.getBalance(courseContract.address);
    balanceContractAfter =
      parseFloat(ethers.utils.formatEther(balanceContractAfter)) * 10 ** 18;

    expect(balanceContractAfter).to.equal(0);
    expect(balanceAfter).to.above(balanceBefore);
  });

  it('Should throw an error if you want to withdraw money but you are not the owner', async function () {
    const [owner, addr1] = await ethers.getSigners();
    await expect(
      courseContract
        .connect(addr1)
        .withDrawMoney(hre.ethers.utils.parseEther('0.1'))
    ).to.be.revertedWith('You must be the owner to withdraw.');
  });

  it('Should return the price of the lesson', async function () {
    const amount = await courseContract.getAmount();
    expect(amount).to.be.equal(coursePrice);
  });

  it('Should return the uri of the course', async function () {
    const uri = await courseContract.contractURI();
    expect(uri).to.be.equal(ipfsFakeURL);
  });

  it('Should return the number of courses that were bought', async function () {
    const txn1 = await courseContract.takeClass({
      value: hre.ethers.utils.parseEther('1'),
    });
    await txn1.wait();
    const txn2 = await courseContract.takeClass({
      value: hre.ethers.utils.parseEther('1'),
    });
    await txn2.wait();
    const number = await courseContract.getNumberOfTokenMinted();

    expect(number).to.be.equal(3);
  });

  it('Should give the possibility to the owner to transfer the ownership of the main NFT', async function () {
    const [owner, addr1] = await ethers.getSigners();
    const txn = await courseContract.safeTransferFrom(
      owner.address,
      addr1.address,
      0,
      1,
      []
    );
    await txn.wait();

    let balanceOwner = await courseContract.balanceOf(owner.address, 0);
    balanceOwner =
      parseFloat(ethers.utils.formatEther(balanceOwner)) * 10 ** 18;
    let balanceAddr = await courseContract.balanceOf(addr1.address, 0);
    balanceAddr = parseFloat(ethers.utils.formatEther(balanceAddr)) * 10 ** 18;

    expect(balanceOwner).to.equal(0);
    expect(balanceAddr).to.equal(1);
  });

  it('Should be impossible for the owner of an NFT class to transfer it to someone else', async function () {
    const [, addr1, addr2] = await ethers.getSigners();
    await expect(
      courseContract
        .connect(addr1)
        .safeTransferFrom(addr1.address, addr2.address, 1, 1, [])
    ).to.be.revertedWith('Only the ownership NFT is transferable.');
  });

  // it('Should throw an error if we are trying to do use the batch transfer of the ERC1155', async function () {
  //   const [owner, addr1] = await ethers.getSigners();
  //   const data = '';
  //   const txn = await courseContract.safeBatchTransferFrom(
  //     owner.address,
  //     addr1.address,
  //     [1, 2, 3],
  //     [1, 1, 1],
  //     data
  //   );

  //   await txn.wait();
  // });
});
