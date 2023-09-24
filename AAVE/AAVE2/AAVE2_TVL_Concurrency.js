const Web3 = require('web3');
const uniswapABI = require('../../ABI/uniswap.json');
const priceOracleAbi = require('../../ABI/priceOracle.json');
const erc20ABI = require('../../ABI/erc20.json');
var lendingAbi = require('../../ABI/lending_pool.json');

// 有问题
// 以 eth 为锚定，精度为 18
const web3 = new Web3('https://nodes.mewapi.io/rpc/eth');
// const web3 = new Web3('https://eth-mainnet.public.blastapi.io');

// uniswapRouter v2
const uniswapRouter = new web3.eth.Contract(uniswapABI ,'0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D');

// aave lending pool v2 contract instance
var lendingContractInstance = new web3.eth.Contract(lendingAbi, '0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9');

// price Oracle contract instance
var priceInstance = new web3.eth.Contract(priceOracleAbi, '0xA50ba011c48153De246E5192C8f9258A2ba79Ca9');

let tokensToTVL = new Map();

// get all tokens price by async
const main = async function (max) {
    let allTokens = await lendingContractInstance.methods.getReservesList().call();
    console.log(allTokens);
    // store 1000000000000000000 WETH coin, retrieve 1810790567 USDT
    // 数量最终还需要 / 10^18
    let pricesPair = await uniswapRouter.methods.getAmountsOut('1000000000000000000', ['0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', '0xdAC17F958D2ee523a2206206994597C13D831ec7']).call();
    // 一个以太兑换的 u 的数量(精度为 6，求出的结果/10^6)
    console.log('pricesPair:', pricesPair);
    // 计算的数量一定要除以 U 的精度
    let oneEth = pricesPair[1] / 10 ** 6;
    console.log("1ETH exchange ", oneEth, "USDT");

    let pool = [];

    for (let i = 0; i < allTokens.length; i++) {
        // 解析 ctoken 对应的精度, 因为后续参数获取都需要 tuple，所以我们需要确保它已经取到
        let tuple = await lendingContractInstance.methods.getReserveData(allTokens[i]).call();
        // access decimals tuple[configuration[data]]
        let data = tuple.configuration.data;
        // 填充满 16 字节， 32 代表整个字符串中包含的字符数量
        let dataHex = web3.utils.padLeft(web3.utils.numberToHex(data), 64);
        let bytes = web3.utils.hexToBytes(dataHex);
        // decimals 位于低位第 7 个字节，即高位第 26 个字节 (索引 25)
        var decimal = bytes[25];

        // atoken
        let aTokenAddress = tuple.aTokenAddress;
        
        // 使用并发的方式获取几个参数
        let task = process(allTokens[i], aTokenAddress)
        pool.push(task);
        task.then((value) => {
            const symbol = value[0];
            const totalSupply = value[1];
            let oraclePrice = value[2];
            
            // 求 token 的价格（相对于 ETH）
            oraclePrice = oraclePrice * oneEth / 1e18;
            // let x = new BigNumber(oraclePrice)
            // let tvl = x.multipliedBy(totalSupply) / Math.pow(10, decimal);
            
            // tvl = 总的锁仓量价值
             let tvl = totalSupply * oraclePrice / Math.pow(10, decimal);
            tokensToTVL.set(allTokens[i], tvl);
            console.log('symbol:', symbol,'totalSupply:', totalSupply, 'tvl:', tvl);    

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
    
    // let decimals = await erc20Instance.methods.decimals().call();
    // let name = await erc20Instance.methods.name().call();
    let totalSupply = erc20Instance.methods.totalSupply().call();
    
    // 以 USDT 计价（需要除以精度）
    let oraclePrice = priceInstance.methods.getAssetPrice(tokenAddress).call();
    
    return Promise.all([symbol, totalSupply, oraclePrice]);
}

// get specify address price
async function getTokensTVL(address) {
    console.time('flag');
    // 初次加载
    if ( tokensToTVL.size == 0 ) {
        await main(8);
    }

    console.log('specify address TVL:', tokensToTVL.get(address));
    console.timeEnd('flag');
}


getTokensTVL('0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599');