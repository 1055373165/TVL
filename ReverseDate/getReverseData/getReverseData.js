const lendingAbi = require('../../ABI/lending_pool.json');
const Web3 = require('web3');
const web3 = new Web3('https://cloudflare-eth.com');


// aave lending pool v2 contract instance
var lendingContractInstance = new web3.eth.Contract(lendingAbi, '0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9');

const getReverseData = async function() {
    // get reserve data info（The specified token）
    const tuple = await lendingContractInstance.methods.getReserveData('0x0D8775F648430679A709E98d2b0Cb6250d2887EF').call()
    let data = tuple.configuration.data;
    console.log('configuration data:', data);
    console.log('tuple: ',tuple);
    // console.log("tuple:")
    // console.log("{")
    // console.log('liquidityIndex: ',tuple.liquidityIndex);
    // console.log('variableBorrowIndex: ',tuple.variableBorrowIndex);
    // console.log('currentLiquidityRate: ',tuple.currentLiquidityRate);
    // console.log('currentVariableBorrowRate: ',tuple.currentVariableBorrowRate);
    // console.log('currentStableBorrowRate: ',tuple.currentStableBorrowRate);
    // console.log('lastUpdateTimestamp: ',tuple.lastUpdateTimestamp);
    // console.log('aTokenAddress: ',tuple.aTokenAddress);
    // console.log('stableDebtTokenAddress: ',tuple.stableDebtTokenAddress);
    // console.log('variableDebtTokenAddress: ',tuple.variableDebtTokenAddress);
    // console.log('interestRateStrategyAddress: ',tuple.interestRateStrategyAddress);
    // console.log('id: ',tuple.id);
    // console.log("}")
}

getReverseData();