const Web3 = require('web3');
const priceOracleAbi = require('../../ABI/priceOracle.json');
const erc20ABI = require('../../ABI/erc20.json');
var poolV3ABI = require('../../ABI/pool_v3.json');

// 以 eth 为锚定，精度为 18
const web3 = new Web3('https://nodes.mewapi.io/rpc/eth');
// const web3 = new Web3('https://eth-mainnet.public.blastapi.io');

// aave lending pool v3 contract instance
var lendingContractInstance = new web3.eth.Contract(poolV3ABI, '0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2');

// price Oracle contract instance
var priceInstance = new web3.eth.Contract(priceOracleAbi, '0x54586bE62E3c3580375aE3723C145253060Ca0C2');

let tokensToTVL = new Map();

// get all tokens price by async
const main = async function (max) {
    let allTokens = await lendingContractInstance.methods.getReservesList().call();
    let pool = [];
    
    for (let i = 0; i < allTokens.length; i++) {
        let tuple = await lendingContractInstance.methods.getReserveData(allTokens[i]).call();
        // configuration 
        // let configuration = await lendingContractInstance.methods.getConfiguration(allTokens[i]).call();
        // access decimals tuple[configuration[data]]
        let data = tuple.configuration.data;
        // 填充满 16 字节， 32 代表整个字符串中包含的字符数量
        let dataHex = web3.utils.padLeft(web3.utils.numberToHex(data), 64);
        let bytes = web3.utils.hexToBytes(dataHex);
        // decimals 位于低位第 7 个字节，即高位第 32-7+1 个字节 (索引 25)
        let decimal = bytes[25];

        // atoken
        let aTokenAddress = tuple.aTokenAddress;
            
        // 使用并发的方式获取几个参数
        let task = process(allTokens[i], aTokenAddress)
        pool.push(task);
        task.then((value) => {
            const symbol = value[0];
            const totalSupply = value[1];
            let oraclePrice = value[2];
            
            // tvl = 总的锁仓量价值
            let tvl = totalSupply * oraclePrice / 10 ** (decimal+8);
            console.log('tokens:', symbol, 'price:', oraclePrice, 'tvl:', tvl);   

            // 任务完成，从 pool 中移除
            pool.splice(pool.indexOf(task), 1);
        })
        
        if (pool.length == max) {
            await Promise.allSettled(pool);
        }
    }

    while (pool.length > 0) {
        await Promise.allSettled(pool);
    }
}

const process = (tokenAddress, aTokenAddress) => {
    // erc20 contract instance
    var erc20Instance = new web3.eth.Contract(erc20ABI, aTokenAddress);
    let symbol = erc20Instance.methods.symbol().call();
    let totalSupply = erc20Instance.methods.totalSupply().call();

    let oraclePrice = priceInstance.methods.getAssetPrice(tokenAddress).call();
    return Promise.all([symbol, totalSupply, oraclePrice]);
}

// get specify address price
async function getTokensTVL() {
    console.time('time used');
    // 初次加载
    if ( tokensToTVL.size == 0 ) {
        await main(8);
    }
    console.log('\n');
    console.timeEnd('time used');
}

getTokensTVL()