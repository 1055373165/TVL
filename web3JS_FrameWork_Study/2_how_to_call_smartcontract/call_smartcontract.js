// 1. 将 web3.js 导入 node.js 脚本
var Web3 = require('web3');
// 2.  初始化一个 web3 实例 
const web3 = new Web3('wss://mainnet.infura.io/ws/v3/437b550826914756922619d58d32215c')

// 3. 从 ethereumscan 获取 gnt token 的 abi
var gntABI = [{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}];

// 4. gnt contract address
var gntAddress = "0x7De7ad6448bB77a857B8ad71d99C4fcC00894854";
// 5. 待查询余额的地址
var address = "0xc49cee55a099349bc5a67a6a454dbad3833e7b14"; 
// 6. 获取实例化合约对象（以要调用合约的 abi 和合约地址为参数调用 web3.eth.Contract 获取合约实例化对象）
var gntContract = new web3.eth.Contract(gntABI, gntAddress);

// 7. 使用实例化的合约对象调用函数即可
gntContract.methods.balanceOf(address).call()
.then((res) => {
    console.log(res);
})
.catch((error) => {
    console.error(error);
})