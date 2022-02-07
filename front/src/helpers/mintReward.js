import abi from '../utils/courseReward.json';
import { ethers } from 'ethers';
import { pinJSONToIPFS } from './pinFileOnIpfs';

export async function mintReward(_toAddress, _signer, _data) {
  return new Promise(async (resolve, reject) => {
    try {
      const contractAddress = '0xa6793e8AdD9f98C24AA2273f0D37222CB6754c14';
      const courseRewardContract = new ethers.Contract(
        contractAddress,
        abi.abi,
        _signer
      );
      const url = await pinJSONToIPFS(_data);
      const mintTxn = await courseRewardContract.safeMint(_toAddress, url);
      const result = await mintTxn.wait();
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}
