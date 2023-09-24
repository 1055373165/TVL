// import web3.js    
const Web3 = require("web3");
// initiate web3 instance (connected to hosted mainnet node) 
const web3 = new Web3("https://cloudflare-eth.com");


// Transfer Event Abi
const eventAbi = [{
        type: 'address',
        indexed: true,
        name: 'from'
    },{
        type: 'address',
        indexed: true,
        name: 'to'
    },{
        type: 'uint256',
        indexed: false,
        name: 'value'
}];

// transfer 事件签名，作为 topics[0]
const eventSign = web3.eth.abi.encodeEventSignature('Transfer(address,address,uint256)');

web3.eth.getTransactionReceipt('0xa219bcdce7d79138cf6c2d8e7bbe500bceb16f377d9a9a9c1d7f6182891c7830')
.then((res) => {
    let logs = res.logs; // 交易收据的 logs 
    for (let i = 0; i < logs.length; i++) {
        if (logs[i].topics[0] == eventSign) { // 如果是 Transfer 事件
            // 解析 data ，参数为：事件 abi、待解析的数据 data、事件中两个被索引的字段
            let decodedata = web3.eth.abi.decodeLog(eventAbi, logs[i].data, [logs[i].topics[1], logs[i].topics[2]]);
            console.log('id:',logs[i].id);
            console.log('from:',decodedata[0]);        
            console.log('to:',decodedata[1]);        
            console.log('value:',decodedata[2]);        
            console.log();
        }
    }
})
.catch((error) => {
    console.error(error);
})