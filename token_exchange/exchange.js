// uniswapV2 Contract's ABI
const uniswapV2ABI = require("./uniswapV2.json");

// import web3.js
var Web3 = require("web3");

// initiate web3 instance (connected to hosted mainnet node) 
const web3 = new Web3("https://cloudflare-eth.com");

// uniswapV2Address
const uniswapV2Address = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"
// uniswapV2Address Object
var priceContractInstance = new web3.eth.Contract(uniswapV2ABI, uniswapV2Address);
// call (Use Promise)

// DAI 精度 18 位
// USDT 精度 6 位

// 场景 1：存入 1 DAI，计算可以撤出的 USDT 的数量，因此需要使用方法 getAmountsOut
// DAI 为存入的代币，所以调用形式为：getAmountsOut("1000000000000000000", ['DAI_ADDRESS', 'USDT_ADDRESS'])
// return amount['store', 'retrieve'] ['dai', 'usdt']
priceContractInstance.methods.getAmountsOut("1000000000000000000", ['0x6B175474E89094C44Da98b954EedeAC495271d0F','0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48']).call()
.then((result) => {
    console.log(`store ${result[0]/1e18} DAI coin, retrieve ${result[1]/1e6} USDT`);
})
.catch((error) => {
    console.error(error);
})

// ['weth', 'usdt']
priceContractInstance.methods.getAmountsOut("1000000000000000000", ['0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', '0xdAC17F958D2ee523a2206206994597C13D831ec7']).call()
.then((result) => {
    console.log(`store ${result[0]/1e18} WETH coin, retrieve ${result[1]/1e6} USDT`);
})
.catch((error) => {
    console.error(error);
})
// 场景 2：取出 997651 USDT，计算需要往池中存入的 DAI 的数量，所以需要使用方法 getAmountsIn
// DAI 为存入代币，USDT 为撤出代币，所以调用形式：getAmountsIn("997651", ['DAI_ADDRESS','USDT_ADDRESS'])
// return [ 'DAI' '997651000000']
priceContractInstance.methods.getAmountsIn("997651000000", ['0x6B175474E89094C44Da98b954EedeAC495271d0F','0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48']).call()
.then((result) => {
    console.log(`retrieve ${result[1]/1e6} USDT , store ${result[0]/1e18} DAI`);
})
.catch((error) => {
    console.error(error);
})

// 场景 3：存入 997651 USDT，计算可以撤出的 DAI 的数量，因此需要使用方法 getAmountsOut
// 存入的代币位于前面，所以调用方式为：getAmountsOut('997651000000', ['USDT', 'DAI'])
// return [997651, DAI_Out]
priceContractInstance.methods.getAmountsOut("997651000000", ['0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', '0x6B175474E89094C44Da98b954EedeAC495271d0F']).call()
.then((result) => {
    console.log(`store ${result[0]/1e6} USDT coin, retrieve ${result[1]/1e18} DAI`);
})
.catch((error) => {
    console.error(error);
})

// 场景 4：取出 DAI 1000000000000000000，计算需要存入的 USDT 的数量，所以需要调用 getAmountsIn
// 因为 DAI 为取出代币，所以位于地址数组后面，调用形式为：getAmountsIn('1000000000000000000', [USDT, DAI])
// [USDT, 1000000000000000000]
priceContractInstance.methods.getAmountsIn("1000000000000000000", ['0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', '0x6B175474E89094C44Da98b954EedeAC495271d0F']).call()
.then((result) => {
    console.log(`retrieve ${result[1]/1e18} DAI , store ${result[0]/1e6} USDT`);
})
.catch((error) => {
    console.error(error);
})

