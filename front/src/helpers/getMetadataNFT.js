import Moralis from 'moralis';
import axios from 'axios';

export async function getMetadataNFT(nftAddress) {
  return new Promise(async (resolve, reject) => {
    try {
      let options = {
        chain: 'mumbai',
        address: nftAddress,
        token_id: '0',
      };
      let tokenIdMetadata = await Moralis.Web3API.token.getTokenIdMetadata(
        options
      );
      if (tokenIdMetadata.metadata) {
        const content = JSON.parse(tokenIdMetadata.metadata);
        resolve({ ...content.metadata, address: nftAddress });
      } else {
        const content = await axios.get(tokenIdMetadata.token_uri);
        if (content.data && content.data.metadata) {
          resolve({ ...content.data.metadata, address: nftAddress });
        } else {
          resolve(null);
        }
      }
    } catch (err) {
      resolve(null);
    }
  });
}
