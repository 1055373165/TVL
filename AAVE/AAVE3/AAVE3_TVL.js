const Web3 = require('web3');
const priceOracleAbi = require('../../ABI/priceOracle.json');
const erc20ABI = require('../../ABI/erc20.json');
const poolV3ABI = require('../../ABI/pool_v3.json');

const web3 = new Web3('https://nodes.mewapi.io/rpc/eth');

// 以 usdt 为锚定（精度为 8）
/*
1. aave pool v3 contract instance
2. call getReserveList to get all tokens address
3. call getReserveData to get decimal
4. 
*/
// aave lending pool v3 contract instance
var lendingContractInstance = new web3.eth.Contract(poolV3ABI, '0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2');

// price Oracle contract instance
var priceInstance = new web3.eth.Contract(priceOracleAbi, '0x54586bE62E3c3580375aE3723C145253060Ca0C2');

let m = new Map();

// get all tokens price by async
const main = async function() {
    console.time('time used');
    let allTokens = await lendingContractInstance.methods.getReservesList().call();

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
        
        // erc20 contract instance
        var erc20Instance = new web3.eth.Contract(erc20ABI, aTokenAddress);
        let symbol = await erc20Instance.methods.symbol().call();
        let totalSupply = await erc20Instance.methods.totalSupply().call();

        let oraclePrice = await priceInstance.methods.getAssetPrice(allTokens[i]).call();

        // tvl = 总的锁仓量价值
        let tvl = totalSupply * oraclePrice / 10 ** (decimal+8);
        console.log('tokens:', symbol, 'price:', oraclePrice, 'tvl:', tvl);
    }
    console.log('\n');
    console.timeEnd('time used');
}

main();