const Web3 = require('web3');
const uniswapABI = require('../../ABI/uniswap.json');

const web3 = new Web3('https://nodes.mewapi.io/rpc/eth');

const uniswapRouter = new web3.eth.Contract(uniswapABI ,'0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D');

const main = async function() {
    // getAmountsOut 调用时，根据后面代币摆放顺序来决定存入哪种代币，取出哪种代币
    // 比如下面一行代码中，我们将 WETH 的地址放到了数组前面，将 USDT 的地址放到了数组后面，这就意味着本次调用是：
    // 往流动性池中存入 1 WETH 可以撤出多少 USDT。最终返回的结果也是一个数组，类似于[1000000000000000000, 1832000000]
    // 去掉精度后（分别为 18 和 6），我们就可以得到 [ 1 1832 ] 的结果，它就代表了 1WETH = 1832 USDT
    let pricesPair = await uniswapRouter.methods.getAmountsOut('1000000000000000000', ['0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', '0xdAC17F958D2ee523a2206206994597C13D831ec7']).call();
    console.log('pricesPair:',pricesPair);
    let oneEth = pricesPair[1] / 10 ** 6;
    console.log("1ETH exchange ", oneEth, "USDT");
}

main();