const Web3 = require('web3');

const erc20ABI = require('../json/erc20.json');
const compoundOracleABI = require('../json/compoundOracleABI.json');
const compoundABI = require('../json/compound.json');
const cTokenABI = require('../json/cTokenABI.json');
const MKRABI = require('../json/MKR.json');


const web3 = new Web3('https://nodes.mewapi.io/rpc/eth');

const compoundContractInstance = new web3.eth.Contract(compoundABI, '0x3d9819210A31b4961b30EF54bE2aeD79B9c9Cd3B');
const compouondOracleInstance = new web3.eth.Contract(compoundOracleABI, '0x50ce56A3239671Ab62f185704Caedf626352741e');

/** cTokenToTVL
 * @param key address
 * @param value Total Value Locked（TVL：总锁仓价值）
 */

const Struct = {
    chainID: Number,
    cTokenToTVL: new Map(),
    cTokenAddressToSymbol: new Map(),
    cTokenToUnderlying: new Map(),
}

const Data = Object.create(Struct);

const main =  async function() {
    // 获取所有 CToken 地址
    const allMarkets = await compoundContractInstance.methods.getAllMarkets().call();
    console.log(allMarkets);
    // 遍历处理所有 CToken 并获取 TVL
    for (let i = 0; i < allMarkets.length; i++) {     
        if (allMarkets[i] ==  '0xF5DCe57282A584D2746FaF1593d3121Fcac444dC') { // sai token is deprecated
            continue
        }

        // 打印 ctoken、供应量信息, 因为下面 erc20Instance 还会被其他合约实现，声明为 var
        const erc20Instance = new web3.eth.Contract(erc20ABI, allMarkets[i]); // ctoken erc20 contract instance
        const symbol = await erc20Instance.methods.symbol().call(); // 
        const totalSupply = await erc20Instance.methods.totalSupply().call(); // 获取 ctoken 代币总的供应量

        // map ctoken address to symbol
        Data.cTokenAddressToSymbol.set(allMarkets[i], symbol);

        // 质押因子信息
        // const results = await compoundContractInstance.methods.markets(allMarkets[i]).call(); 
        // console.log(symbol, 'collateralFactorMantissa:', results[1] / 10 ** 18); // collateral Factor 例如 cBAT 为 60% 

        // compound v2 合约实例
        const cTokenInstance = new web3.eth.Contract(cTokenABI, allMarkets[i]); // cToken contract instance 

        // cToken 精度和底层 erc20 代币类型
        var decimal = 0;
        var underlying = '';

        //  cETH 底层类型就是自己
        if (allMarkets[i] == '0x4Ddc2D193948926D02f9B1fE9e1daa0718270ED5') { // if === cETH
            underlying = '0x4Ddc2D193948926D02f9B1fE9e1daa0718270ED5';
            decimal = 18;
        } else { // 获取 ctoken 的底层代币类型，比如 cDAI 的底层代币为 DAI
            underlying = await cTokenInstance.methods.underlying().call(); // 获取向 compound 提供的代币底层类型
            decimal = await erc20Instance.methods.decimals().call(); // 获取该代币的精度
        }

        var underERC20 = '';
        var underdecimal = 0;
        // 由于 MKR 的 symbol() 返回值不是标准 erc20 标准中的 string 类型而是 bytes32 类型，所以需要单独处理
        if (allMarkets[i] == '0x95b4eF2869eBD94BEb4eEE400a99824BF5DC325b') {
            // const underERC20Instance = new web3.eth.Contract(MKRABI, underlying);
            // const bytes = await underERC20Instance.methods.symbol().call(); // bytes32
            // underERC20 = web3.utils.bytesToHex(bytes);
            // underERC20 = underERC20.slice(0, 20);// just need 20 bytes
            underERC20 = 'MKR';
            underdecimal = 18;
        } else {
            const underERC20Instance = new web3.eth.Contract(erc20ABI, underlying);
            underERC20 = await underERC20Instance.methods.symbol().call();
            underdecimal = await underERC20Instance.methods.decimals().call();
        }
        // map ctoken symbol to underlying symbol
        Data.cTokenToUnderlying.set(symbol, underERC20);

        // access token price by Oracle （decimal 在打印时考虑）
        const price = await compouondOracleInstance.methods.getUnderlyingPrice(allMarkets[i]).call(); 
        // access the exchangeRate between ctoken and underlying token
        let exchangeRate = await cTokenInstance.methods.exchangeRateCurrent().call();
        // const exchangeRate = await cTokenInstance.methods.exchangeRateStored().call(); // 兑换比率

        const tvl = web3.utils.toBN(totalSupply) * web3.utils.toBN(exchangeRate) * web3.utils.toBN(price) / 1e48;
        // store cToken -> tvl into memory
        Data.cTokenToTVL.set(allMarkets[i], tvl/1e6);

        // todo: oraclePrice calculate : price * 10 ** decimal / 1e30

        // print detail information
        console.log('ctoken = ', symbol, 'tvl = ', tvl / 1e6);
    }
}


/**
 * 
 * @param {*} cToken : 要查询的 cToken 地址
 */
// 获取指定 cToken 地址对应的 Token name、底层代币类型以及对应的 TVL 信息
const getSpecifyMarketsTVL = async function(cToken) {
    console.time('flag');
    if (Data.cTokenToTVL.size == 0) {
        // 执行 main 函数获取所有 ctoken 的 tvl 数据并存入内存中
        await main();
    }

    // 取值返回, 给出查询地址对应 ctoken 的 symbol、 underlying token symbol 、 以及 TVL 
    const symbol = Data.cTokenAddressToSymbol.get(cToken);
    const underlying = Data.cTokenToUnderlying.get(symbol);
    const tvl = Data.cTokenToTVL.get(cToken);

    console.log(`
查询的 cToken 地址为 ${cToken}
对应的 cToken Symbol 为 ${symbol}
cToken 对应的底层代币 Symbol 为 ${underlying}
cToken 对应的 TVL 为：${tvl}$
    `)
    console.timeEnd('flag');
}


getSpecifyMarketsTVL('0x95b4eF2869eBD94BEb4eEE400a99824BF5DC325b').catch((err) => {
    console.error(err);
});

// main() 获取所有 Market 的 TVL
// main().catch((err) => {
//     console.error(err);
// });