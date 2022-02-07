export async function ConnectWalletAction() {
  return new Promise(async (resolve, reject) => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert('Get MetaMask!');
        return;
      }
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });
      resolve(accounts[0]);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
}
