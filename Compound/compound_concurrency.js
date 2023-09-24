const Web3 = require('web3');

const erc20ABI = require('../json/erc20.json');
const compoundOracleABI = require('../json/compoundOracleABI.json');
const compoundABI = require('../json/compound.json');
const cTokenABI = require('../json/cTokenABI.json');
const MKRABI = require('../json/MKR.json');


const web3 = new Web3('https://nodes.mewapi.io/rpc/eth');

const compoundContractInstance = new web3.eth.Contract(compoundABI, '0x3d9819210A31b4961b30EF54bE2aeD79B9c9Cd3B');
const compouondOracleInstance = new web3.eth.Contract(compoundOracleABI, '0x50ce56A3239671Ab62f185704Caedf626352741e');

/**
 * @key cToken address
 * @value cToken's Total Value Locked（TVL：总锁仓价值）
 */

const Struct = {
    chainID: Number,
    cTokenToTVL: new Map(),
    cTokenAddressToSymbol: new Map(),
    cTokenToUnderlying: new Map(),
}

const Data = Object.create(Struct);

const main =  async function(max) {
    // 获取所有 CToken 地址
    const allMarkets = await compoundContractInstance.methods.getAllMarkets().call();
    console.log(allMarkets);

    // task pool
    let pool = [];

    // 遍历处理所有 CToken 并获取 TVL
    for (let i = 0; i < allMarkets.length; i++) {     
        if (allMarkets[i] ==  '0xF5DCe57282A584D2746FaF1593d3121Fcac444dC') { // sai token is deprecated
            continue
        }

        // cToken 精度和底层 erc20 代币类型
        // todo let 和 var 的变量作用域
        // todo 比较并发版本和非并发版本的时间差值
        let decimal = 0;
        var underlying = '';

        const cTokenInstance = new web3.eth.Contract(cTokenABI, allMarkets[i]); // cToken contract instance

        //  cETH 底层类型就是自己
        if (allMarkets[i] == '0x4Ddc2D193948926D02f9B1fE9e1daa0718270ED5') { // if === cETH
            underlying = '0x4Ddc2D193948926D02f9B1fE9e1daa0718270ED5';
            decimal = 18;
        } else { // 获取 ctoken 的底层代币类型，比如 cDAI 的底层代币为 DAI
            underlying =  await cTokenInstance.methods.underlying().call(); // 获取向 compound 提供的代币底层类型
            var erc20Instance = new web3.eth.Contract(erc20ABI, underlying); // 该底层代币的 erc20 合约实例 
            decimal = await erc20Instance.methods.decimals().call(); // 获取该代币的精度
        }

        // 计算 underlying symbol 需要依赖上面的 underlying
        var underERC20 = '';
        // MKR
        if (allMarkets[i] == '0x95b4eF2869eBD94BEb4eEE400a99824BF5DC325b') {
            const underERC20Instance = new web3.eth.Contract(MKRABI, underlying);
            const bytes =  await underERC20Instance.methods.symbol().call(); // bytes32
            underERC20 = web3.utils.bytesToHex(bytes);
            underERC20 = underERC20.slice(0, 20);// just need 20 bytes
        } else {
            const underERC20Instance = new web3.eth.Contract(erc20ABI, underlying);
            underERC20 =  await underERC20Instance.methods.symbol().call();
        }

        // 并发上下文仅能传递 字符串类型数据
        const task = process(allMarkets[i]);
        pool.push(task);
        // value = [exchangeRate, symbol, price, totalSupply] array 形式
        task.then((value) => {
            const exchangeRate = value[0];
            const symbol = value[1];
            const price = value[2];
            const totalSupply = value[3];

            // map cToken symbol to underlying symbol
            Data.cTokenToUnderlying.set(symbol, underERC20);

            // map cToken Address to cToken symbol
            Data.cTokenAddressToSymbol.set(allMarkets[i], symbol);
            
            // calculate tvl by multiplication of large numbers
            const tvl = web3.utils.toBN(totalSupply) * web3.utils.toBN(exchangeRate) * web3.utils.toBN(price) / 1e48;
            // store cToken -> tvl into memory
            Data.cTokenToTVL.set(allMarkets[i], tvl/1e6);

            // print detail information
            console.log('ctoken = ', symbol, 'oraclePrice = ', web3.utils.toBN(price) * Math.pow(10, decimal)  / 1e30, 'tvl = ', tvl / 1e6);
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

// 将每个 cToken 的处理过程放入到一个并发任务中
const process = (address) => {
    // 打印 ctoken、供应量信息, 因为下面 erc20Instance 还会被其他合约实现，声明为 var
    var erc20Instance = new web3.eth.Contract(erc20ABI, address); // ctoken erc20 contract instance
    const symbol =  erc20Instance.methods.symbol().call(); // 
    const totalSupply = erc20Instance.methods.totalSupply().call(); // 获取 ctoken 代币总的供应量

    // compound v2 合约实例
    const cTokenInstance = new web3.eth.Contract(cTokenABI, address); // cToken contract instance 

    // access ctoken price by Oracle （decimal 在打印时考虑）
    const price = compouondOracleInstance.methods.getUnderlyingPrice(address).call(); // 调用预言机合约的api求得该 ctoken 的价格

    // access the exchangeRate between ctoken and underlying token
    // 作为未 resolve 的 Promise 返回
    const exchangeRate = cTokenInstance.methods.exchangeRateStored().call(); // 兑换比率

    // 所有异步任务完成
    return Promise.all([exchangeRate, symbol, price, totalSupply]);
}

// 1. 如果是首次调用，那么需要执行一次 main 函数获取所有 cToken 的 TVL 数据，首次执行较慢，耐心等待
// 2. 如果非首次调用，那么直接返回存储在内存中的值即可
const getAllMarketsTVL = async function(cToken) {
    console.time('flag');
    if (Data.cTokenToTVL.size == 0) {
        // 执行 main 函数获取所有 ctoken 的 tvl 数据并存入内存中
        await main(8);
    }

    // 取值返回, 给出查询地址对应 ctoken 的 symbol、 underlying token symbol 、 以及 TVL 
    const symbol = Data.cTokenAddressToSymbol.get(cToken);
    const underlying = Data.cTokenToUnderlying.get(symbol);
    const tvl = Data.cTokenToTVL.get(cToken);

    console.log(`
查询的 cToken 地址为 ${cToken},
对应的 cToken Symbol 为 ${symbol},
cToken 对应的底层代币 Symbol 为 ${underlying},
cToken 对应的 TVL 为：$${tvl}  
    `)
    console.timeEnd('flag');
}

// main().catch((err) => {
//     console.error(err);
// });

getAllMarketsTVL('0x35A18000230DA775CAc24873d00Ff85BccdeD550').catch((err) => {
    console.error(err);
});