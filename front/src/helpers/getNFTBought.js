import Moralis from 'moralis';
import axios from 'axios';

export async function getNFTBought(user, courseAddress) {
  return new Promise(async (resolve, reject) => {
    try {
      const polygonNFTs = await Moralis.Web3API.account.getNFTs({
        chain: 'mumbai',
        address: user,
      });
      for (let nft of polygonNFTs.result) {
        if (nft.token_address.toLowerCase() === courseAddress.toLowerCase()) {
          if (nft.metadata) {
            const object = JSON.parse(nft.metadata);
            resolve({
              success: true,
              owner: true,
              video_link: object.ipfs_video_url,
              content: object.content,
            });
          } else if (!nft.is_valid) {
            const result = await axios.get(nft.token_uri);
            resolve({
              success: true,
              owner: true,
              video_link: result.data.ipfs_video_url,
              content: result.data.content,
            });
          }
        }
      }
      resolve({ sucess: true, owner: false, video_link: '', content: '' });
    } catch (err) {
      reject(err);
    }
  });
}
