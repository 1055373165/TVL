# 设置 WEB3.JS 以用 JAVASCRIPT 操作 ETHEREUM 区块链

# 总

1. 将 web3.js 加入到项目中

如果需要在网页中使用它：使用下面的方式引入 

<aside>
😈 <script src="https://cdn.jsdelivr.net/npm/web3@latest/dist/web3.min.js"></script>
</aside>

本地项目中使用

<aside>
😈 npm install web3 --save
</aside>

1. 将 web3.js 导入 node.js 脚本

> var Web3 = require(”web3”);

1. 初始化一个 web3 实例 

> const web3 = new Web3(”http://localhost:8545”);   (ganache 本地节点)

> const web3 = new Web3(”http://cloudflare-eth.com”); （托管节点 ：Infura 免费节点：cloudflare、alchemy节点）

1. 测试实例是否初始化成功

```jsx
var Web3 = require("web3");

const web3 = new Web3("http://cloudflare-eth.com");

web3.eth.getBlockNumber(function(error, result) {
	console.log(result);
});
```

1. 因为 web3 库大部分都是异步的，我们可以使用 asyncawait 来异步执行，防止嵌套回调

```jsx
var Web3 = require("web3");

const web3 = new Web3("http://cloudflare-eth.com");

// 声明一个异步执行的函数
async function getBlockNumber() {
	const latestBlockNumber = await web3.eth.getBlockNumber();
	console.log(latestBlockNumber);
	return latestBlockNumber;
}
// 调用函数
getBlockNumber();
```

1. 有些账户还需要解锁

```jsx
if (window.ethereum != null) {
	state.web3 = new Web3(window.ethereum)
	try {
		await window.ethereum.enable();
	} catch(error) {
		console.log(error);
	}
}
```

# 分

第一步是将 web3.js 加入到您的项目中。 要在网页中使用它，您可以使用 JSDeliver 等 CDN 直接导入库。

```jsx
<script src="https://cdn.jsdelivr.net/npm/web3@latest/dist/web3.min.js"></script>
```

如果您更喜欢在后端或使用 build 的前端项目中安装库，可以使用 npm 进行安装：

```jsx
npm install web3 --save
```

接下来，要将 Web3.js 导入 Node.js 脚本或 Browserify 前端项目，您可以使用以下 JavaScript 代码行：

```jsx
const Web3 = require("web3");
```

现在我们在项目中加入了库，我们需要对其进行初始化。 您的项目需要能够与区块链通信。 大部分以太坊库通过 RPC 的调用与[节点](https://ethereum.org/zh/developers/docs/nodes-and-clients/)进行通信。

 要启动我们的 Web3 提供程序，我们将实例化一个 Web3 实例，并将该提供程序的 URL 作为构造函数传递。 

如果您有一个节点或 [ganache 实例在您的计算机上运行(opens in a new tab)↗](https://ethereumdev.io/testing-your-smart-contract-with-existing-protocols-ganache-fork/)，它看起来将是这样：

```solidity
const web3 = new Web3("http://localhost:8545");
```

如果您想直接访问一个托管节点，您可以使用 Infura。 您也可以使用由 [Cloudflare(opens in a new tab)↗](https://cloudflare-eth.com/)、[Moralis(oens in a new tab)↗](https://moralis.io/) 或 [Alchemy(opens in a new tab)↗](https://alchemy.com/ethereum)提供的免费节点：

```jsx
const web3 = new Web3("https://cloudflare-eth.com");
```

为了测试我们是否正确配置了 Web3 实例，我们将尝试使用 `getBlockNumber` 函数检索最新的区块编号。 该函数接受回调作为参数，并以整数形式返回区块编号。

```jsx
var Web3 = require("web3");

const web3 = new Web3("https://cloudflare-eth.com");

web3.eth.getBlockNumber(function(error, result){
	console.log(result)
});
```

如果您执行这个程序，它只会打印最新的区块编号：区块链的顶部。 您还可以使用 `await/async` 函数调用来避免在代码中嵌套回调：

```jsx
// 声明一个异步调用的函数
async function getBlockNumber() {
	const latestBlockNumber = await web3.eth.getBlockNumber();
	console.log(latestBlockNumber);
	return latestBlockNumber;
}

getBlockNumber();
```

大多数 Web3 库都是异步的，因为在后台，该库对返回结果的节点进行 JSON RPC 调用。

如果您在浏览器中操作，一些钱包会直接`注入 Web3 实例`，您应该尽可能尝试使用它，特别是在您打算与用户的以太坊地址交互以进行交易时。

下面的代码片段用来检测 MetaMask 钱包是否可用，如果可用，则尝试启用它。 稍后它将允许您读取用户的余额，并使它们能够验证您想让它们在以太坊区块链上进行的交易：

```jsx
if (window.ethereum != null) {
	state.web3 = new Web3(window.ethereum)
	try {
		// request account access if neeed 解锁账户
		await window.ethereum.enable()
		// account now exposed 帐户现已暴露
		...operation
	} catch(error) {
		// user denied account access...
	}
}
```

# 总

npm install web3 --save

```jsx
var Web3 = require("web3");

const web3 = new Web3("http://cloudflare-eth.com");
const web3 = new Web3("https://sepolia.infura.io/v3/437b550826914756922619d58d32215c")
// 需要先启动 ganache
const web3 = new Web3("https://localhost:8545")

async function getBlockNumber() {
	const latestBlockNumber = await web3.eth.getBlockNumber();
	console.log(latestBlockNumber);
	return latestBlockNumber;
}

getBlockNumber();
```

![](images/2023-09-24-20-09-54.png)