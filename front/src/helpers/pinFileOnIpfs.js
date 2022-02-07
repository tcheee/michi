import env from 'react-dotenv';
import axios from 'axios';

const pinataApiKey = env.PINATA_KEY;
const pinataSecretApiKey = env.PINATA_SECRET_KEY;

export async function pinFileToIPFS(selectedFile, title) {
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
  let data = new FormData();
  data.append('file', selectedFile);

  const metadata = JSON.stringify({
    name: title,
  });

  data.append('pinataMetadata', metadata);

  const pinataOptions = JSON.stringify({
    cidVersion: 0,
    customPinPolicy: {
      regions: [
        {
          id: 'FRA1',
          desiredReplicationCount: 1,
        },
        {
          id: 'NYC1',
          desiredReplicationCount: 2,
        },
      ],
    },
  });
  data.append('pinataOptions', pinataOptions);

  const result = axios
    .post(url, data, {
      maxBodyLength: 'Infinity', //this is needed to prevent axios from erroring out with large files
      headers: {
        'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
        pinata_api_key: pinataApiKey,
        pinata_secret_api_key: pinataSecretApiKey,
      },
    })
    .then(function (response) {
      console.log(response);
      return 'https://ipfs.io/ipfs/' + response.data.IpfsHash;
    })
    .catch(function (error) {
      console.log(error);
    });

  return result;
}

export async function pinJSONToIPFS(JSONBody) {
  const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
  return axios
    .post(url, JSONBody, {
      headers: {
        pinata_api_key: pinataApiKey,
        pinata_secret_api_key: pinataSecretApiKey,
      },
    })
    .then(function (response) {
      console.log(response);
      return 'https://ipfs.io/ipfs/' + response.data.IpfsHash;
    })
    .catch(function (error) {
      //handle error here
    });
}
