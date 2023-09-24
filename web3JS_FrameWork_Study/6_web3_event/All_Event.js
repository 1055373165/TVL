
const Web3 = require("web3");
const web3 = new Web3('wss://eth-mainnet.g.alchemy.com/v2/U3Qa-y48FUN_MV-L4BdGD9MT3bMJyV_5');
// https://cloudflare-eth.com/
// https://mainnet.infura.io/v3/437b550826914756922619d58d32215c

// 合约 Transfer 事件 ABI
const cAAVE_Transfer = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Transfer","type":"event"}]
// 合约对象
const cAAVE = new web3.eth.Contract(cAAVE_Transfer, '0xe65cdB6479BaC1e22340E4E755fAE7E509EcD06c');

const transferSign = web3.eth.abi.encodeEventSignature('Transfer(address,address,uint256)');
console.log("要监听事件的签名值为：",transferSign);
// todo: 过滤器
cAAVE.events.allEvents({
    filter: {
        // to: ['0x28aEAB635Aaf4F68D0f88834C8637174257d942C'],
        topics: [transferSign]
    },
    fromBlock: 17356700,
}, function(error, event){ console.log(event); })
.on("connected", function(subscriptionId){
    console.log('All事件订阅成功，订阅号为：',subscriptionId);
})
.on('data', function(event){
    console.log(event); // 与上述可选的回调结果相同
})
.on('changed', function(event){
    console.log("修改本地数据库");
})
.on('error', function(error, receipt) { // 如果交易被网络拒绝并带有交易收据，第二个参数将是交易收据。
    console.log(error, receipt);
});
