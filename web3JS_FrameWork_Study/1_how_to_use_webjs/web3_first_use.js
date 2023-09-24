
var Web3 = require("web3");

// 实例化方法 1
const web3 = new Web3("http://cloudflare-eth.com");

// 实例化方法 2
// const web3 = new Web3("https://sepolia.infura.io/v3/437b550826914756922619d58d32215c")

// 实例化方法 3：需要先启动 ganache
// const web3 = new Web3("https://localhost:8545")

async function getBlockNumber() {
	const latestBlockNumber = await web3.eth.getBlockNumber();
	console.log(latestBlockNumber);
	return latestBlockNumber;
}

getBlockNumber();

// 18205548