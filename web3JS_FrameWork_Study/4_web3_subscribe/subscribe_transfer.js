// 监听所有的 DAI 合约发起转账的事件
const Web3 = require("web3");
const web3 = new Web3('wss://eth-mainnet.g.alchemy.com/v2/U3Qa-y48FUN_MV-L4BdGD9MT3bMJyV_5');


const inputAbi = [{
    type: 'address',
    name: 'from',
    indexed: true
},{
    type: 'address',
    name: 'to',
    indexed: true
},{
    type: 'uint256',
    name: 'value',
    indexed: false        
}]

const subscription = web3.eth.subscribe('logs', {
    address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    topics: ['0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef']
}, function(error, result){
    if (!error)
        console.log('监听到的日志全部信息:');
        console.log(result);
})
.on("connected", function(subscriptionId){
    console.log('订阅成功，订阅号：',subscriptionId);
})
.on("data", function(log){
    console.log('日志解析数据:')
    var decodeData = web3.eth.abi.decodeLog(inputAbi, log.data, [log.topics[1], log.topics[2]]);
    console.log('from: ', decodeData[0]);
    console.log('to: ', decodeData[1]);
    console.log('value: ', decodeData[2]);
})
.on("changed", function(log){
});