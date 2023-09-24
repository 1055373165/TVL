const Web3 = require('web3');

const compoundABI = require("../json/compound.json")
const web3 = new Web3('http://cloudflare-eth.com/');
const compoundContractInstance = new web3.eth.Contract(compoundABI, '0x3d9819210A31b4961b30EF54bE2aeD79B9c9Cd3B');

const main = async function() {
    // 获取所有 CToken 地址
    const allMarkets = await compoundContractInstance.methods.getAllMarkets().call();
    console.log(allMarkets);
}

main();