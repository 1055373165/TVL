const Web3 = require('web3');
const uniswapABI = require('../../ABI/uniswap.json');
const priceOracleAbi = require('../../ABI/priceOracle.json');
const erc20ABI = require('../../ABI/erc20.json');
const lendingAbi = require('../../ABI/lending_pool.json');

const web3 = new Web3('https://nodes.mewapi.io/rpc/eth');

// uniswapRouter v2 uniswap 价格预言机
// aave v2 版本是以 Ether 的价格来计算的
// 一般使用美元表示 Ether 的价格，即 1 ETH = x USDT 
// 所以我们需要使用 unsiwap 的价格预言机调用 ETH-USDT 的 swap，计算此时以太坊相对于 U 的价格 比如 1 ETH = 1800 USDT
const uniswapRouter = new web3.eth.Contract(uniswapABI ,'0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D');

// aave lending pool v2 contract instance
// aave v2 借贷池合约实例
const lendingContractInstance = new web3.eth.Contract(lendingAbi, '0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9');

// price Oracle contract instance
// aave v2 价格预言机合约实例
var priceInstance = new web3.eth.Contract(priceOracleAbi, '0xA50ba011c48153De246E5192C8f9258A2ba79Ca9');

// 用来存储 AAVE 支持代币的 TVL
let tokensToTVL = new Map();

// 打印所有 AAVE V2 支持代币列表的 TVL 信息
const main = async function () {
    // 调用 getReservesList API 获取 AAVE V2 支持的代币列表（地址形式显示）
    let allTokens = await lendingContractInstance.methods.getReservesList().call();
    console.log(allTokens);
    
    /* 
     调用 uniswap 的 WETH-USDT Swap ，求 1WETH 的价格 （such as 1WETH = 1831 USDT）
     参数 1：1000000000000000000 wei = 1 ETH  
     参数 2: ['0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', '0xdAC17F958D2ee523a2206206994597C13D831ec7'] 代表 swap 组合[WETH, USDT]
     返回值 : pricesPair [1000000000000000000, 1831726593] swap：[WETH, USDT] 精度分别为 [18, 6]
     所以去掉精度后可以得到两个代币直接的价格关系 [1 1831]
     这就得出了 1 个以太可以兑换 1831 个 USDT 
    */
    let pricesPair = await uniswapRouter.methods.getAmountsOut('1000000000000000000', ['0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', '0xdAC17F958D2ee523a2206206994597C13D831ec7']).call();
    console.log('pricesPair:',pricesPair);
    let oneEth = pricesPair[1] / 10 ** 6;
    console.log("1ETH exchange ", oneEth, "USDT");

    // 求出单个以太价格后，我们需要求当前 token 可以兑换多少个 ETH，一旦得出这个值，再乘以上面的以太价格，就可以得出 token 的价格
    for (let i = 0; i < allTokens.length; i++) {
        // 解析 ctoken 对应的精度
        let tuple = await lendingContractInstance.methods.getReserveData(allTokens[i]).call();
        // access decimals tuple[configuration[data]]
        let data = tuple.configuration.data;
        // 填充满 16 字节， 64 代表整个字符串中包含的字符数量
        let dataHex = web3.utils.padLeft(web3.utils.numberToHex(data), 64);
        let bytes = web3.utils.hexToBytes(dataHex);
        // decimals 位于低位第 7 个字节，即高位第 26 个字节 (索引 25)
        let decimal = bytes[25];


        // 类似于 cToken 的一种代币，比如 USDT 对应的 aToken 为 aUSDT
        let aTokenAddress = tuple.aTokenAddress;

        // erc20 contract instance
        const erc20Instance = new web3.eth.Contract(erc20ABI, aTokenAddress);
        // 获取类似 aUSDT 的名称
        let symbol = await erc20Instance.methods.symbol().call();
        // 获取 aToken 的总供应量
        let totalSupply = await erc20Instance.methods.totalSupply().call();
        
        // 获取当前处理代币的价格（单位 wei，即相对于以太的价格） 比如
        let oraclePrice = await priceInstance.methods.getAssetPrice(allTokens[i]).call();

        // 获取当前处理代币的价格（相对于 USDT 的价格）
        // token = xxx wei = xxx / 1e18 eth = xxx / 1e18 * oneEth USDT 
        // 推导出下面公式 ： token price = xxx * oneEth / 1e18
        // oraclePirce 是该代币相对于以太的价格(wei)  所以需要 / 1e18 转换为 Ether，然后再乘以一个 Ether 相对于 U 的价格
        oraclePrice = oraclePrice / 1e18 * oneEth;

        // tvl = 总的锁仓量价值（求 aToken 的总价值）
        // 我们已经知道单个 token 的价格（U），只需要乘以它的供应量就可以得出它的锁仓量（别忘了除以精度）。
        let tvl = totalSupply * oraclePrice / Math.pow(10, decimal);

        // store the map relationship
        tokensToTVL.set(allTokens[i], tvl);

        console.log('symbol:',symbol,'totalSupply:', totalSupply, 'tvl:', tvl);
    }
}

// get specify address TVL
async function getTokensTVL(address) {
    console.time('time used');
    // 初次加载
    if ( tokensToTVL.size == 0 ) {
        await main();
    }

    console.log('specify address Price:', tokensToTVL.get(address));
    console.timeEnd('time used');
}


getTokensTVL('0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599');