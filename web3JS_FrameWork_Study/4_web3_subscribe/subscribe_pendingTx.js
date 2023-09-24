// 监听所有的 DAI 合约发起转账的事件
const Web3 = require("web3");
const web3 = new Web3('wss://eth-mainnet.g.alchemy.com/v2/U3Qa-y48FUN_MV-L4BdGD9MT3bMJyV_5');

const subscription = web3.eth.subscribe('pendingTransactions',
    function(error, result){
    if (!error)
        console.log('待处理交易哈希值：',result);
})
.on("data", function(transaction){
    console.log(transaction);
});

// 取消订阅
subscription.unsubscribe(function(error, success){
    if(success)
        console.log('Successfully unsubscribed!');
});