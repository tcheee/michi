const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Test for the Course Factory Contract', function () {
  const ipfsFakeURL = 'https://ipfs.io/ipfs/FakeURL';
  const coursePrice = 10;
  let factoryContract;
  before(async function () {
    const FactoryContract = await ethers.getContractFactory('CourseFactory');
    factoryContract = await FactoryContract.deploy();
    await factoryContract.deployed();
  });

  it('Should create a new lesson contract', async function () {
    const txn = await factoryContract.createLesson(coursePrice, ipfsFakeURL);
    const result = await txn.wait();
    const allLessons = await factoryContract.getContracts();

    expect(allLessons.length).to.be.equal(1);
    expect(result.events[0].address).to.be.equal(allLessons[0]);
  });

  it('Should emit an event when a new course is created', async function () {
    const txn = await factoryContract.createLesson(coursePrice, ipfsFakeURL);
    await txn.wait();

    await expect(
      factoryContract.createLesson(coursePrice, ipfsFakeURL)
    ).to.emit(factoryContract, 'NewContractCreated');
  });

  it('Should return a list of all courses that were created through the factory', async function () {
    const newLessons = [1, 2, 3, 4, 5];
    const allLessonsBefore = await factoryContract.getContracts();
    const results = [...allLessonsBefore];

    await Promise.all(
      newLessons.map(async (element) => {
        const txn = await factoryContract.createLesson(
          coursePrice + element,
          ipfsFakeURL
        );
        const result = await txn.wait();
        results.push(result.events[0].address);
      })
    );
    const allLessons = await factoryContract.getContracts();

    expect(results).to.be.eql(allLessons);
  });

  it('Should return a list of all courses that were created by a specific address', async function () {
    const [, addr1] = await ethers.getSigners();
    const newLessons = [1, 2];

    await Promise.all(
      newLessons.map(async (element) => {
        const txn = await factoryContract
          .connect(addr1)
          .createLesson(coursePrice + element, ipfsFakeURL);
        await txn.wait();
      })
    );
    const addressLessons = await factoryContract.getCourses(addr1.address);

    expect(addressLessons.length).to.be.equal(2);
  });
});
