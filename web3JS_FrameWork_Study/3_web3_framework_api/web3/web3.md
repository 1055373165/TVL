# Web3

<aside>
💡 Web3类是一个“伞”包，在Web3类下包含所有与以太坊相关的模块。
</aside>



# web3

web3 库的主类.

```jsx
var Web3 = require('web3');
```

```
> Web3.utils
> Web3.version
> Web3.givenProvider
> Web3.providers
> Web3.modules
```

# Web3.modules

```go
Web3.modules
```

将返回所有主要子模块类的对象 , 以便可以手动实例化他们 . 

**return `Object` (模块构造函数列表)**

- Eth - Constructor : 与以太坊网络交互的 Eth 模块 .  (参见 web3.eth )
- Net - Constructor  : 与网络属性进行交互的 Net 模块  ( [web3.eth.net](http://web3.eth.net) )
- Personal - Constructor : 与以太坊账户交互的 Personal 模块 ( web3.eth.personal )
- Shh - Constructor : 与 whisper 协议交互的 Shh 模块  ( web3.shh )
- Bzz - Constructor : 与 Swarm 网络交互的 Bzz 模块 ( web3.bzz )

```go
Web3.modules
> {
    Eth: Eth(provider),
    Net: Net(provider),
    Personal: Personal(provider),
    Shh: Shh(provider),
    Bzz: Bzz(provider),
}
```

# web3 实例

```go
var Web3 = require('web3');

// 创建 web3 的实例 , 如果浏览器支持以太坊浏览器, 那么 Web3.providers.givenProvider 会被设置
var web3 = new Web3(Web3.givenProvider || 'ws://some.local-or-remote.node:8545');
```

实例创建完成后 , 可以使用 

```go
> web3.eth
> web3.shh
> web3.bzz
> web3.utils
> web3.version
```

# Provider

- Object - WebsocketProvider : websocket provider 是在`传统浏览器`(legacy browser)中使用的标准。
- Object - IpcProvider : `IPC provider` 在运行本地节点时使用 node.js dapps。给予`最安全`的连接。
- Object - HttpPrivider : deprecated 因为不能支持订阅而不推荐使用

**WebsocketProvider**

```jsx
var Web3 = require('web3'); // 主类

var web3 = new Web3(Web3.givenProvider || 'ws:remotenode.com:8546');
or
var web3 = new Web3(Web3.givenProvider || new Web3.providers.WebsocketProvider('ws:remotenode.com:8546');
```

**IpcProvider**

> 在 node.js 中使用 IPC provider

```jsx
var net = require('net');

var web3 = new Web3('/Users/apple/Library/Ethereum/geth.ipc', net);
or
var web3 = new Web3(new Web3.provider.IpcProvider('/Users/apple/Library/Ethereum/geth.ipc'), net);
```

## givenProveder

在和以太坊兼容的浏览器中使用 web3.js 时，当前环境的原生 provider 会被浏览器设置。

web3.givenProvider 将返回浏览器设置的原生 provider ，否则返回 `null`。

return `Object`: 浏览器设置好的 provider 或者 `null`;

```jsx
web3.givenProvider
web3.eth.givenProvider
web3.shh.givenProvider
web3.bzz.givenProvider
...
```

## currentProvider

返回当前正在使用的 provider 或者 `null`

```jsx
web3.currentProvider
web3.eth.currentProvider
web3.shh.currentProvider
web3.bzz.currentProvider
...
```

## setProvider

改变对应模块的 Provider .

parameter : 一个有效的 provider . 

return : `boolean`

```jsx
var web3 = require('web3');
var web3 = new Web3('http://localhost:8545');
or
var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

// change provider
web.setProvider('ws:localhost:8546');
web3.setProvider(new Web3.providers.WebsocketProvider('ws://localhost:8546'));
```

<aside>
💡 当我们通过 web3 包调用它的时候, web3.eth , web3. shh 等子模块的 provider 会同步被修改 . 
但 web3.bzz (与 swarm 网络交互的) 是个例外, 他总是需要一个单独的 provider .


</aside>

# BatchRequest 批量请求

```jsx
new web3.BatchRequest()
new web3.eth.BatchRequest()
new web3.shh.BatchRequest()
new web3.bzz.BatchRequest()
```

用来创建并执行批量请求的类

return `Object` 

该 Object 拥有以下方法 : 

- add(request) : 将请求对象添加到批处理调用 (增加新的请求)
- execute : 执行批量请求

执行请求需要调用合约方法, 所以我们需要`合约类` {提供 abi 和合约地址}

<aside>
😈 abi 提供了调用方法的参数和返回值信息


</aside>

```jsx
// 创建调用指定合约的类
var contract = new web3.eth.Contract(abi, address);

// 创建执行批量处理请求的类
var batch = new web3.BatchRequest();
// 往批处理对象中添加查询指定地址余额的请求 
// latest 代表最新的状态信息 , 并提供回调函数
batch.add(web3.eth.getBalance.request('0x0000000000000000000000000000000000000000', 'latest', callback));
// 添加合约调用请求
batch.add(contract.methods.balance(address).call.request({from: '0x0000000000000000000000000000000000000000'}, callback2));
// 执行批处理请求
batch.execute();
```

1. 创建合约类 (提供 abi 和合约地址)
2. 创建批请求处理类
3. 往批处理对象中添加请求.
4. 执行批处理请求

# extend

```jsx
web3.extend(methods)
web3.eth.extend(methods)
web3.shh.extend(methods)
web3.bzz.extend(methods)
...
```

- parameter METHOD - Object : 扩展对象, 拥有以下方法 :
	- methods - Array : 方法描述对象数组
		- property - String : 要添加到模块上的属性名称 .
		- `name` - `String`: 要添加的方法名称。
		- `call` - `String`: RPC 方法名称。
		- `params` - `Number`: (可选) 方法的参数个数，默认值为 0。
		- `inputFormatter` - `Array`: (可选) 输入格式化函数数组，每个成员对应一个函数参数，或者使用 null 来对应不需要进行格式化处理的参数。
		- `outputFormatter - ``Function`: (可选) 用来格式化方法输出。
- return - Object : 扩展模块

```jsx
var web3 = require('web3');
var web3 = new Web3();

web3.extend({
	property: 'myModule',  // 添加到该模块的属性名称
	methods: [{
		names: 'getBalance', // 添加 getBalance 方法
		call: 'eth_getBalance', // web3.js rpc 方法名称
		params: 2, // getBalance()
		inputFormatter: [web3.extend.formatters.inputAddressFormatter, web3.extend.formatters.inputDefaultBlockNumberFormatter], // 格式化输入 
		outputFormatter: web3.utils.hexToNumberString   // 格式化输出 16进制 hex Number 类型数据 -> String 类型输出
	},{
		name: 'getGasPriceSuperFunction', // 添加获取 gasPrice 方法
		call: 'eth_gasPriceSuper',        // web3.js rpc 方法名
		params: 2,     // 方法所需要的参数个数
		inputFormatter: [null, web3.utils.numberToHex] // 输入格式化
	}]
});

现在我们扩展了一个 myModule 的模块, 该模块提供了两个方法 分别是 getBalance 和 gasPrice 方法

web3.extend({
	methods: [{
		name: 'directCall',
		call: 'eth_callForFun'
	}]
});

// 打印 web3 类的内容
console.log(web3);
```

**output:**

```jsx
> Web3 {
    myModule: {
        getBalance: function(){},
        getGasPriceSuperFunction: function(){}
    },
    directCall: function(){},
    eth: Eth {...},
    bzz: Bzz {...},
    ...
}
```