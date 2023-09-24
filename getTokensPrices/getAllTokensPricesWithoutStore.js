const Web3 = require('web3');

const priceOracleAbi = require('../ABI/priceOracle.json');
var lendingAbi = require('../ABI/lending_pool.json')
// web3 instance
const web3 = new Web3('http://cloudflare-eth.com/');

// aave lending pool v2 contract instance
var lendingContractInstance = new web3.eth.Contract(lendingAbi, '0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9');

// get all tokens address
function getAllTokens() {
    let allTokens = lendingContractInstance.methods.getReservesList().call();

    return allTokens;
}

let m = new Map();

// get all tokens price by async
async function getAllTokensPrice() {
    var priceInstance = new web3.eth.Contract(priceOracleAbi, '0xA50ba011c48153De246E5192C8f9258A2ba79Ca9');
    var allTokens = await getAllTokens();

    for (let i = 0; i < allTokens.length; i++) {
        let price = await priceInstance.methods.getAssetPrice(allTokens[i]).call();
        console.log(allTokens[i],':',web3.utils.fromWei(price), 'ether');
        m.set(allTokens[i], price);
    }
}

// get specify address price
async function getTokenPrice(address) {
    // wait m loaded
    console.time('time flag') 
    await getAllTokensPrice();
    console.log('specify address Price:', m.get(address));
    console.timeEnd('time flag') 
}

getTokenPrice('0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599');


// 1. get lending pool v2 contract address instance
// 2. call getAllTokens to get all tokens address
// 3. init a map
// 4. traverse all tokens address and call getAssetPrice for its price which should be stored in the map
// 5. after all tokens price loaded (keep data up to date), get the address's price from map 