const Web3 = require('web3');

const priceOracleAbi = require('../ABI/priceOracle.json');
var aaveAbi = require('../ABI/aave2.json');
var lendingAbi = require('../ABI/lending_pool.json');

// web3 instance
const web3 = new Web3('http://cloudflare-eth.com/');


// aave token address
const aaveAddress = '0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5';
const lendingAddress = '0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9';
const priceOracleAddress = '0xA50ba011c48153De246E5192C8f9258A2ba79Ca9';

// get contract instance
const contractInstance = new web3.eth.Contract(aaveAbi, aaveAddress);


// call getLendingPool to get LendingPool contract address
function getLendingPoolAddress() {
    let address = contractInstance.methods.getLendingPool().call;
    return address;
}

// call getPriceOracle to get PriceOracle address
function getPriceOracle() {
    let address = contractInstance.methods.getPriceOracle().call();
    return address;
}

// aave lending pool v2 contract instance
var lendingContractInstance = new web3.eth.Contract(lendingAbi, lendingAddress);

function getAllTokens() {
    // get all tokens address
    let allTokens = lendingContractInstance.methods.getReservesList().call();

    return allTokens;
}


let m = new Map();

async function getAllTokensPrice() {
    var priceInstance = new web3.eth.Contract(priceOracleAbi, priceOracleAddress);
    var allTokens = await getAllTokens();

    for  (let i = 0; i < allTokens.length; i++) {
        let price = await priceInstance.methods.getAssetPrice(allTokens[i]).call()
        m.set(allTokens[i], price);
        console.log(allTokens[i], "=>", web3.utils.fromWei(price, 'ether'), "ethers")
    }
}
// store all tokens prices in a local map
async function accessTokenPrices() {
    var start = new Date().getTime(); // 开始时间
    await getAllTokensPrice();    
    var end = new Date().getTime(); // 结束时间
    console.log('总耗时：', (end-start)/1000, "秒");
}

accessTokenPrices();