const Web3 = require('web3');
const lendingAbi = require('../../ABI/lending_pool.json');
const erc20ABI = require('../../ABI/erc20.json');

const web3 = new Web3('https://nodes.mewapi.io/rpc/eth');

// aave v2 借贷池合约实例
const lendingContractInstance = new web3.eth.Contract(lendingAbi, '0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9');

const main = async function () {
    // 调用 getReservesList API 获取 AAVE V2 支持的代币列表（地址形式显示）
    let allTokens = await lendingContractInstance.methods.getReservesList().call();
    console.log(allTokens);
    
    for (let i = 0; i < allTokens.length; i++) {
        // 获取 token 的 tuple 信息
        let tuple = await lendingContractInstance.methods.getReserveData(allTokens[i]).call();
        let aTokenAddress = tuple.aTokenAddress;
        
         // erc20 contract instance
        const erc20Instance = new web3.eth.Contract(erc20ABI, aTokenAddress);
        // 获取类似 aUSDT 的名称
        let symbol = await erc20Instance.methods.symbol().call();
        
        // access decimals tuple[configuration[data]]
        let data = tuple.configuration.data;
        // 填充满 32 字节， 64 代表整个字符串中包含的字符数量
        let dataHex = web3.utils.padLeft(web3.utils.numberToHex(data), 64);
        let bytes = web3.utils.hexToBytes(dataHex);
        // decimals 位于低位第 7 个字节，即高位第 26 个字节 (索引 25)
        let decimal = bytes[25];
        console.log(`${symbol}'s decimal is ${decimal}`);
    } 
}

main();