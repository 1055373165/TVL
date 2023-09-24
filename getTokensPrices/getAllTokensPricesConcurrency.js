
const Web3 = require('web3');

const priceOracleAbi = require('../ABI/priceOracle.json');
var lendingAbi = require('../ABI/lending_pool.json')
// web3 instance
const web3 = new Web3('http://cloudflare-eth.com/');

// aave lending pool v2 contract instance
var lendingContractInstance = new web3.eth.Contract(lendingAbi, '0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9');
var priceInstance = new web3.eth.Contract(priceOracleAbi, '0xA50ba011c48153De246E5192C8f9258A2ba79Ca9');

// get all tokens address
function getAllTokens() {
    let allTokens = lendingContractInstance.methods.getReservesList().call();
    return allTokens;
}

let m = new Map();

// get all tokens price by async
async function getAllTokensPrices() {
    var allTokens = await getAllTokens();
    await getAllTokenPrice(allTokens, 8);
}

const process = (address) => {
    let price = priceInstance.methods.getAssetPrice(address).call();    
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(price);
        }, 500);
    })
}

async function getAllTokenPrice(tokens, max) {
    // 待执行的任务组
    let pool = [];
    for (let i = 0; i < tokens.length; i++) {
        const task = process(tokens[i]);
        pool.push(task);

        task.then((data) => {
            m.set(tokens[i], data);
            var data_ether = web3.utils.fromWei(data, 'ether');
            console.log(`${tokens[i]}: ${data_ether} ethers ；并发数：${pool.length}`);
            pool.splice(pool.indexOf(task), 1);
        })

        if (pool.length == max) {
            await Promise.race(pool);
        }
    }

    while (pool.length > 0) {
        await Promise.race(pool);
    }
}

async function accessAllTokens() {
    var start = new Date().getTime(); // 开始时间
    await getAllTokensPrices();
    var end = new Date().getTime(); // 结束时间
    console.log("并发查询总执行时间：", (end-start)/1000, "秒")
}

accessAllTokens();