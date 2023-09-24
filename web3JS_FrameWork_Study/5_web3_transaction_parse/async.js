var Web3 = require('web3');
const web3 = new Web3('https://cloudflare-eth.com/');

async function getTxConfirms(txhash){
    const receipt = await web3.eth.getTransactionReceipt(txhash)
    var blocknumber = receipt.blockNumber;
    //later...
    const latest =  await web3.eth.getBlockNumber()
    return latest-blocknumber+1;
  }
  
getTxConfirms('0xa219bcdce7d79138cf6c2d8e7bbe500bceb16f377d9a9a9c1d7f6182891c7830')
  .then(confirms => console.log(confirms))