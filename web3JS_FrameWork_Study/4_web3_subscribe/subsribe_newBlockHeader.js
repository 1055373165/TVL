const Web3 = require("web3");
const web3 = new Web3('wss://eth-mainnet.g.alchemy.com/v2/U3Qa-y48FUN_MV-L4BdGD9MT3bMJyV_5');

var subscription = web3.eth.subscribe('newBlockHeaders', function(error, result){
    if (!error) {
        console.log(result);
        return;
    }

    console.error(error);
})
.on("connected", function(subscriptionId){
    console.log(subscriptionId);
})
.on("data", function(blockHeader){
    console.log(blockHeader);
})
.on("error", console.error);

// 取消订阅
subscription.unsubscribe(function(error, success){
    if (success) {
        console.log('Successfully unsubscribed!');
    }
});