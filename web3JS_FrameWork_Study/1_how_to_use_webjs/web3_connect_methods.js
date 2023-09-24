var Web3 = require('web3');

// provider
var providerUrl = 'https://cloudflare-eth.com/';
// web3Provider object
var web3Provider = new Web3.providers.HttpProvider(providerUrl);
// web3 instance
var web3Instance = new Web3(web3Provider);
web3Instance.eth.getBlockNumber()
	.then((result) => {
		console.log("https://cloudflare-eth.com/最新区块为：", result);
	})
	.catch((error) => {
		console.error(error);
	});




var providerUrl1 = 'https://eth-mainnet.public.blastapi.io/';
var web3Provider1 = new Web3.providers.HttpProvider(providerUrl1);
var web3instance1 = new Web3(web3Provider1);

web3instance1.eth.getBlockNumber()
    .then((result) => {
        console.log(`https://eth-mainnet.public.blastapi.io/最新区块: ${result}`);
    })
    .catch((error) => {
        console.log(error);
    })





var providerUrl2 = 'https://nodes.mewapi.io/rpc/eth';
var web3Provider2 = new Web3.providers.HttpProvider(providerUrl2);
var web3instance2 = new Web3(web3Provider2);

web3instance2.eth.getBlockNumber()
    .then((result) => {
        console.log(`https://nodes.mewapi.io/rpc/eth/最新区块: ${result}`);
    })
    .catch((error) => {
        console.log(error);
    })