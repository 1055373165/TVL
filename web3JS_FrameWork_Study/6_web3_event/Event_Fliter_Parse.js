const Web3 = require("web3");
const web3 = new Web3('wss://eth-mainnet.g.alchemy.com/v2/U3Qa-y48FUN_MV-L4BdGD9MT3bMJyV_5');

// 事件签名 hash
const transferSign = web3.eth.abi.encodeEventSignature('Transfer(address,address,uint256)');
// 合约 Transfer 事件 ABI
const cAAVE_Transfer = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Transfer","type":"event"}]

// 合约对象
const cAAVE = new web3.eth.Contract(cAAVE_Transfer, '0xe65cdB6479BaC1e22340E4E755fAE7E509EcD06c');

// 查询历史区块，并过滤出相关事件
// ['0x9BD48e08E3444B30113812acd52458b35C33803A']
// cAAVE 是一个合约 0xe65cdB6479BaC1e22340E4E755fAE7E509EcD06c

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

// Transfer 事件过滤，设置过滤器
// 1. from：交易发起者
// 2. to：交易接收者
// 3. fromBlock: 起始区块
cAAVE.events.Transfer({
    filter: {
        from: ['e65cdb6479bac1e22340e4e755fae7e509ecd06c'],
        to: ['9bd48e08e3444b30113812acd52458b35c33803a']
    },
    fromBlock: 1730000
}, function(error, result) {
})
.on('data', function(event) {
    let raw = event.raw;
    let decodeData = web3.eth.abi.decodeLog(inputAbi, raw.data, [raw.topics[1], raw.topics[2]]);
    console.log('from: ', decodeData[0])
    console.log('to: ', decodeData[1])
    console.log('value: ', decodeData[2])
})
.on('changed', function(event) {
    console.log(event);
})
.on('error', function(error, receipt) {
    console.log(error, receipt);
});