# web3.eth

<aside>
💡 顾名思义, web-eth 包用来与以太坊区块链和智能合约进行交互.


</aside>

有两种方式访问该类对象

1. 引入 web3-eth 包  (web3-eth ≤==> web3.eth)

```jsx
var Eth = require('web3-eth');

// Eth.givenProvider = web3.eth.givenProvider
var eth = new Eth(Eth.givenProvider || 'ws://some.local-or-remote.node:8546');
```

1. 通过 web3 包 创建 web3 对象 , 从而使用 web3.eth 类对象

```jsx
var Web3 = require('web3');

var web3 = new Web3(Web3.givenProvider || 'ws://local-or-remote.node:8547');

// web3.eth ... 即可
```

**关于校验地址的说明**

本包中函数所返回的以太坊地址均为`校验和地址`。 这意味着地址中有些字母是大写的而有些是小些的。

基于此可以计算地址的校验和并以此证明它的正确性。

校验和不正确的地址在传入函数时会抛错。 你可以使用全大写或全小写的地址来绕过校验和检查。

```jsx
web3.eth.getAccounts(console.log);
> ["0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe" ,"0x85F43D8a49eeB85d32Cf465507DD71d507100C1d"]
```

# defaultAccount   默认from地址

> web3.eth.defaultAccount

在某些方法没有指定 “from” 属性时, 使用该地址作为默认的 “from” 属性值

```jsx
web3.eth.sendTransaction()
web3.eth.call()
new web3.eth.Contract() -> myContract.methods.myMethod().call()
new web3.eth.Contract() -> myContract.methods.myMethod().send()
```

**return `string`**

```jsx
 20 字节: 任意以太坊地址。 该地址对应的私钥应该保存在你的以太坊节点或 keystore 文件中。 (默认值为 undefined)
```

```jsx
web3.eth.defaultAccount;
> undefined

// 设置默认账号
web3.eth.defaultAccount = '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe';
```

# defaultBlock 默认区块

> `web3.eth.defaultBlock`

一些特定方法所使用的默认区块号。默认值 ‘latest’ ; 

```jsx
web3.eth.getBalance()
web3.eth.getCode()
web3.eth.getTransactionCount()
web3.eth.getStorageAt()
web3.eth.call()
new web3.eth.Contract() -> myContract.methods.myMethod().call()
```

**return  value** 

默认区块参数值可以下面中的一个：

- `Number|BN|BigNumber`: 指定区块号
- `"genesis"` - `String`: 创世区块
- `"latest"` - `String`: 最新区块 (区块链的头号区块)
- `"pending"` - `String`: 正要挖到的区块 (包括待处理交易)
- `"earliest"` - `String`: 创世区块

默认值为 `"latest"`

```jsx
web3.eth.defaultBlock;
> "latest"

// 设置默认区块
web3.eth.defaultBlock = 231;
```

# defaultHardfork   (默认使用哪个分叉)

**return value**

```jsx
"chainstart" - String
"homestead" - String
"dao" - String
"tangerineWhistle" - String
"spuriousDragon" - String
"byzantium" - String
"constantinople" - String
"petersburg" - String
"istanbul" - String

默认值为 "petersburg" 圣彼得堡分叉
```

```jsx
web3.eth.defaultHardfork;
> "petersburg"

// 设置默认硬分叉
web3.eth.defaultHardfork = 'istanbul';
```

# ****defaultChain 默认链****

- mainnet
- 测试链 name

```jsx
web3.eth.defaultChain;
> "mainnet"

// 设置默认链
web3.eth.defaultChain = 'goerli';
```

# defaultCommon 默认通用属性

签名交易时所使用的默认通用配置.

**return value**

> web3.eth.defaultCommon

默认通用属性包含下面这样的 `Common` 对象：

- customchain - Object {name, networkId, chainId} 定制链属性
- baseChain - {mainnet, goerli, …. }   基链类型
- hardfork : 硬分叉类型

- **`customChain` - `Object`: 自定义链属性**`name` - `string`: (可选) 链名称`networkId` - `number`: 自定义链的网络 ID`chainId` - `number`: 自定义链的链 ID
- `baseChain` - `string`: (可选) `mainnet`, `goerli`, `kovan`, `rinkeby`, or `ropsten`
- `hardfork` - `string`: (可选) `chainstart`, `homestead`, `dao`, `tangerineWhistle`, `spuriousDragon`, `byzantium`, `constantinople`, `petersburg`, or `istanbul`

默认值为 `undefined`。

```jsx
web3.eth.defaultCommon;
> {customChain: {name: 'custom-network', chainId: 1, networkId: 1}, baseChain: 'mainnet', hardfork: 'petersburg'}

// 设置默认通用属性
web3.eth.defaultCommon = {customChain: {name: 'custom-network', chainId: 1, networkId: 1}, baseChain: 'mainnet', hardfork: 'petersburg'};
```

# ****transactionBlockTimeout 等待 timeout 才确认交易 (`todo`)**

> web3.eth.transactionBlockTimeout

`transactionBlockTimeout` ( 事务阻塞超时 )会被用在基于套接字的连接上。该属性定义了直到第一次确认发生交易应该等待的 timeout 超时。

 这意味着当超时发生时，`PromiEvent` 会拒绝并显示超时错误。

**返回值**

`number`: transactionBlockTimeout 当前值 (默认值: 50)

# ****transactionConfirmationBlocks  交易确认区块****

> web3.eth.transactionConfirmationBlocks

一笔交易被认为已确认所需要的区块数.

**返回值**

`number`: transactionConfirmationBlocks 当前值 (默认值: 24)

这个值直接决定了交易上链的速度 , 比如设置为 24 个区块, 平均每个区块出块时间为 15 s , 则一个交易从上链到最终被确认上链需要 360s 也就是 6 分钟. 

# ****transactionPollingTimeout 交易轮询超时 (`todo`)**

> web3.eth.transactionPollingTimeout

`transactionPollingTimeout` 在基于 HTTP 的连接上使用。 这个选项定义了 Web3 等待网络挖出交易的确认收据的秒数。注意：当此种超时发生时，交易可能仍未完成。

**返回值**

`number`: transactionPollingTimeout 当前值 (默认值: 750)

# ****handleRevert  回退处理****

> web3.eth.handleRevert

`handleRevert` 默认值为 `false`，如果在调用下面这些方法时启用，将返回回退原因字符串:

```jsx
web3.eth.call()
web3.eth.sendTransaction()
contract.methods.myMethod(…).send(…)
contract.methods.myMethod(…).call(…)
```

<aside>
💡 回退原因字符串和签名会作为返回错误的属性存在。


</aside>

**返回值**

`boolean`: `handleRevert` 当前值 (默认值: false)

# ****getProtocolVersion 节点以太坊协议版本****

返回节点的以太坊协议版本

**返回值**

`Promise` 返回 `String`: 协议版本。

```jsx
web3.eth.getProtocolVersion() // getProtocolVersion 返回一个 Promise 如果 Promise handle 输出到标准输出
.then(console.log);
> "63"
```

# ****isSyncing 检查当前节点是否正在进行数据同步****

```jsx
web3.eth.isSyncing([callback])
```

**返回值**

`Promise` 返回 `Object|Boolean` - 当节点正在进行数据同步时返回同步对象，否则返回 `false`：

- `startingBlock` - `Number`: 同步开启时的区块号。
- `currentBlock` - `Number`: 节点已经同步到的区块号。
- `highestBlock` - `Number`: 预计会同步到的区块号。
- `knownStates` - `Number`: 预计要下载的状态数据。
- `pulledStates` - `Number`: 已经下载的状态数据。

```jsx
web3.eth.isSyncing()  // 同样是个 Promise 类型的输出
.then(console.log); 

> {
    startingBlock: 100, // 同步开启时的初始区块号
    currentBlock: 312, // 节点当前同步到的区块号
    highestBlock: 512, // 预计会同步到的最高区块号
    knownStates: 234566, // 预计要下载到的状态数据号
    pulledStates: 123455 // 已经下载的状态数据号
}
```

States 涉及到 MPT 的 RootTree , 需要强化对 MPT 的理解

# ****getCoinbase 获取收取挖矿奖励的矿工地址****

返回用来收取挖矿奖励的 coinbase 地址。

**返回值**

`Promise` 返回 `String` - 20 个字节： 在节点中设置的用来挖矿的 coinbase 地址。

```jsx
web3.eth.getCoinbase()
.then(console.log);

> "0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe"
```

# ****isMining 检查节点是否正在挖矿****

```jsx
web3.eth.isMining([callback])
```

**返回值**

`Promise` 返回 `Boolean`: 如果节点正在挖矿返回 `true` ，否则返回 `false`。

```jsx
web3.eth.isMining()
.then(console.log);
> true
```

<aside>
💡 所有调用形式为 web3.eth.functionName([callback]) 都是无需参数, 返回结果为 Promise 的函数, 我们只需要再下面一行添加执行成功的输出到标准输出即可.


web3.eth.Function()
.then(console.log);

</aside>

# ****getHashrate 获取节点算力 (每秒 hash 数)****

> web3.eth.getHashrate([callback]);

**返回值**

**Promise : 返回 Numer : 每秒 hash 数**

```jsx
web3.eth.getHashrate()
.then(console.log);

> 493736
```

# ****getGasPrice 获取当前 gas 价格预言机.****

<aside>
💡 gas 价格将由最后几个区块的 gas 价格的中位数来决定 , 但会造成 gas 费的落后.


</aside>

**返回值**

`Promise` 返回 `String` - 当前以 wei 为单位的 gas 价格。

```jsx
web3.eth.getGasPrice()
.then(console.log);

> "20000000000"
```

[javascript 大数处理 BN(BigNumber)](https://www.notion.so/javascript-BN-BigNumber-24b82cf17e094ceeba4d670504550fb2?pvs=21)

# getAccounts 获取节点控制的所有账户列表

> web3.eth.getAccounts([callback])

**返回值**

`Promise` 返回 `Array` - 节点所控制的节点数组。

```jsx
web3.eth.getAccounts()
.then(console.log);

> ["0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe", "0xDCc6960376d6C6dEa93647383FfB245CfCed97Cf"]
```

# ****getBlockNumber 获取当前区块号****

> web3.eth.getBlockNumber

**返回值**

`Promise` 返回 `Number` - 最近区块号。

```jsx
web3.eth.getBlockNumber()
.then(console.log);

> 274412
```

# **getBalance 返回地址在指定区块的余额**

> web3.eth.getBalance( address [, defaultBlock] [, callback])

**参数**

- String : 要获取余额的地址
- Nubmer | String | BN | BigNumber : 区块号
	- 会覆盖 web3.eth.defaultBlock 的值.
	- 也可以根据 “latest” “earliest” “pending” “genesis” 这种预先设置好的区块号
- Function (可选) : 可选的回调函数, 第一个参数为错误对象 (error) , 第二个参数为函数的运行结果 (handle)  一般情况下不会设置错误处理回调, 只设置 Promise handled 后执行的函数 .

**返回值**

`Promise` 返回 `String` - 给定地址的当前账户余额，以 wei 为单位。

```jsx
web3.eth.getBalance("0x407d73d8a49eeb85d32cf465507dd71d507100c1")
.then(console.log); 
// 回调函数将返回值输出到 console.log 

> > "1000000000000"
```

这里并没有设置区块号 , 会使用 web3.eth.defaultBlock 设置的区块号进行计算.

# ****getStorageAt  获取地址在某个特定位置存储的值 (基于 slot)****

```jsx
web3.eth.getStorageAt(address, position [, defaultBlock] [, calldata])
```

**参数**

- address : `String` 要获取存储值的地址
- Number | String | BN | BigNumber — 存储的索引位置 要访问的 slot 下标
- Number | String | BN | BigNumber — (可选) 不设置该参数时 , 使用 web3.eth.defaultBlock 值 .
- Function — 可选的回调函数 , 与 Promise(Object) 相关

**返回值**

`Promise` 返回 `String` - 给定位置的存储值。

```jsx
web3.eth.getStorageAt("0x407d73d8a49eeb85d32cf465507dd71d507100c1", 0)
.then(console.log);

> "0x033456732123ffff2342342dd12342434324234234fd234fd23fd4f23d4234"
```

# getCode 获取指定地址关联的代码数据

> web3.eth.getCode(address [, defaultBlock] [, callback])

**参数**

1. address - `String` 要获取合约代码的地址
2. Number | String | BN | BigNumber — (可选) 如果传入值则会覆盖通过 [web3.eth.defaultBlock](https://learnblockchain.cn/docs/web3.js/web3-eth.html#eth-defaultblock) 设置的默认区块号。预定义的区块号 `"latest"`, `"earliest"` `"pending"`, 和 `"genesis"` 等也可以使用。
3. `Function` - (可选) 可选的回调函数，其第一个参数为错误对象，第二个参数为函数运行结果。

**return**

`Promise` 返回 `String` - 给定地址的代码数据。

```jsx
web3.eth.getCode("0xd5677cf67b5aa051bb40496e68ad359eb97cfbf8")
.then(console.log);

> "0x600160008035811a818181146012578301005b601b6001356025565b8060005260206000f25b600060078202905091905056"
```

# ****getBlock 根据区块号或者区块 hash 查询区块****

> web3.eth.getBlock(blockHashOrBlockNumber, [, returnTransactionObjects], [, callback])

返回与区块号或区块哈希匹配的区块对象。

**参数**

- blockHash | blockNumber : `String | Number | BN | BigNumber` — 区块号 | 区块哈希 | 预设的区块号
- returnTransactionObjects :  `false` | `true` (可选, 默认为 false) 如果设定为 true

**return**

`Promise` 返回 `Object` - 区块对象:

- number — `Number` 区块号, 打包中的区块其值为 null , 因为处于 pending 状态, 其最终的区块号还不能确定, 所以这段期间都置为 `null` .
- hash (32 字节) — `String` : hash of the block ( sha256 计算出来的 hash 值, 是 merkle root hash 吗? `todo`) 打包中的区块其值为 `null` .
- parentHash 32 字节 — `String` : 父区块的 hash 值.
- nonce 8 bytes (0~2^64-1) `String` : 所生成工作量证明的 hash 值, 打包中的区块其值为 `null` . 区块的 hash 和 nonce 字段都是解决了 hash 难题后才确定的.
- sha3Uncles 32 字节 — `String` : 区块中叔块数据的 SHA3 哈希值.
- logsBloom `256Bytes`   — `String` : 区块日志的布隆过滤器 . 打包中的区块其值为 `null` .
- transactionsRoot 32 字节 — `String` : 区块中交易 trie 树的根 hash 值.
- stateRoot 32 字节 — `String` : 区块中状态 trie 树的根哈希.
- miner — `String` : 获得挖矿奖励的受益人地址.
- difficulty — `String` : 区块难度值
- totalDifficulty — `String` : 到当前区块为止, 链的总难度值 , 用于确定权威链.
- extraData — `String` : 区块补充数据字段.
- size — `Number` : 该区块的字节数大小 .
- gasLimit — `Number` : 该区块允许的`最大 gas 消耗量`.
- gasUsed — `Number` : 该区块所有交易所消耗的 gas 总量.
- timestamp — `Number` : 区块生成时的时间戳.
- transactions -- `Array` : 交易对象数组, 存储了所有交易的 hash 值 . 或者基于 returnTransactionObjects 参数的 32 字节交易 hash  (`todo`)
- uncles — `Array` : 所有叔块组成的 hash 数组.

```jsx
web3.eth.getBlock(3150)
.then(console.log);

> {
    "number": 3,
    "hash": "0xef95f2f1ed3ca60b048b4bf67cde2195961e0bba6f70bcbea9a2c4e133e34b46",
    "parentHash": "0x2302e1c0b972d00932deb5dab9eb2982f570597d9d42504c05d9c2147eaf9c88",
    "nonce": "0xfb6e1a62d119228b",
    "sha3Uncles": "0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347",
    "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
    "transactionsRoot": "0x3a1b03875115b79539e5bd33fb00d8f7b7cd61929d5a3c574f507b8acf415bee",
    "stateRoot": "0xf1133199d44695dfa8fd1bcfe424d82854b5cebef75bddd7e40ea94cda515bcb",
    "miner": "0x8888f1f195afa192cfee860698584c030f4c9db1",
    "difficulty": '21345678965432',
    "totalDifficulty": '324567845321',
    "size": 616,
    "extraData": "0x",
    "gasLimit": 3141592,
    "gasUsed": 21662,
    "timestamp": 1429287689,
    "transactions": [
        "0x9fc76417374aa880d4449a1f7f31ec597f00b1f6f3dd2d66f4c9c6c445836d8b"
    ],
    "uncles": []
}
```

# ****getBlockTransactionCount 返回区块中包含交易的总数****

> web3.eth.getBlockTransactionCount( blockHashOrBlockNumber [, callback] )

****参数****

1. blockNumber | blockHash :`String|Number|BN|BigNumber` — 区块号 | 区块 hash | 预设区块号

2. `Function` - (可选) 可选的回调函数，其第一个参数为错误对象，第二个参数为函数运行结果。

**return**

`Promise` 返回 `Number` - 区块中包含的交易数量。

```jsx
web3.eth.getBlockTransactionCount("0x407d73d8a49eeb85d32cf465507dd71d507100c1")
.then(console.log);
> 1

web3.eth.getBlockTransactionCount(3170)
.then(console.log);
> 1 
```

# ****getBlockUncleCount 获取指定区块的所有叔块数量****

根据叔块的数量可以得出矿工因此获得的额外手续费.

> web3.eth.getBlockUncleCount(blockHashOrBlockNumber [, callback])

**参数**

1. blockhash | blockNumber : `String| Nubmer | BN | BigNumber` : 区块号 | 区块 hash | 预设的区块号
2. Function — `可选` 的回调函数, 第一个参数为 `error` 对象, 另一个参数为 `handle` 对象.

**return**

`Promise` 返回 `Number` - 区块中包含的叔块数量。

```jsx
web3.eth.getBlockUncleCount(500, 0)
.then(console.log);

> 1
```

# getUncle 根据给定的区块的叔块索引返回对应叔块

```jsx
web3.eth.getUncle(blockHashOrBlockNumber, uncleIndex [, returnTransactionObjects]
```

根据给定叔块索引返回对应叔块。

**参数**

1. blockHash | blockNumber | 预设区块号
2. Number : 叔块位置索引
3. Boolean : ( 可选, 默认值为 false ) 如果设定为 true , 返回的区块会包含完整的交易对象. 如果设置为 false , 则返回的区块中仅包含交易哈希值.

**返回值**

`Promise` 返回 `Object` - 返回的叔块对象。 具体返回值可查看 [web3.eth.getBlock()](https://learnblockchain.cn/docs/web3.js/web3-eth.html#eth-getblock)。

<aside>
💡 叔块不包含任何交易。


根据 blockNumber 找到指定的区块, 然后根据叔块索引获取到叔块的 hash 值. 然后调用 web3.eth.getBlock 查询叔块的信息并返回输出到标准输出.

</aside>

```jsx
web3.eth.getUncle(500, 0)
.then(console.log);
```

# getTransaction 返回指定交易 hash 的交易对象

> web3.eth.getTransaction(transactionHash [, callback])

返回匹配交易哈希的交易对象

**参数**

1. txHash : `String` — 交易哈希
2. Function — 可选回调函数

**return**

`Promise` 返回 `Object` - 交易对象，其哈希值为 `transactionHash`

- hash 32 字节 — `String` : 交易哈希
- nonce — `Number` : 发送人在此之前进行的交易次数 . 如果是合约地址, 则代表部署的合约数.
- blockHash 32 字节 — `String` : 该交易所在区块的区块哈希 . 打包中的区块其值为 null .
- blockNumber — `Number` : 该交易所在区块的区块号, 打包中的区块其值为 `null` .
- transactionIndex — `Number` : 该交易在区块中的位置索引 , 打包中的区块其值为 `null` . 除非区块确认, 交易才能确认, 交易的最终顺序才能确定.
- from — `String` : 交易发送人地址 .
- to — `String` : 交易接收人地址 , 如果 to 的值为 null , 则代表新创建合约的交易.
- value — `String` : 转账金额 , 以 wei 为单位.
- gasPrice — `String` : 由发起人指定的 gas 价格, wei .
- gas — `Number` : 由发送人指定的 gas 数量 .
- input — `String` : 伴随交易发送的数据.

```jsx
web3.eth.getTransaction('0x9fc76417374aa880d4449a1f7f31ec597f00b1f6f3dd2d66f4c9c6c445836d8b')
.then(console.log);

> {
    "hash": "0x9fc76417374aa880d4449a1f7f31ec597f00b1f6f3dd2d66f4c9c6c445836d8b",
    "nonce": 2, // 该交易发起人的第 2 笔交易
    "blockHash": "0xef95f2f1ed3ca60b048b4bf67cde2195961e0bba6f70bcbea9a2c4e133e34b46",  // 交易打包进的区块 hash
    "blockNumber": 3, // 交易打包进的区块的区块号
    "transactionIndex": 0, // 交易的位置索引 , 是这个区块的第一笔交易
    "from": "0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b", // 发起人地址
    "to": "0x6295ee1b4f6dd65047762f924ecd367c17eabf8f", // 接收者地址
    "value": '123450000000000000', // 转账金额 , wei
    "gas": 314159, // 发起人指定的 gas 量
    "gasPrice": '2000000000000', // 发起人指定的 gas 价格, 如果不指定则使用默认的 gasPrice  **gasPrice * gas = gasLimit**
    "input": "0x57cb2fc4" 
}
```

# getPendingTransactions

> web3.eth.getPendingTransactions([, callback])

返回等待处理的交易列表 .  (位于交易池 mempool 中)

**参数**

1. `Function` - (可选) 可选的回调函数，其第一个参数为错误对象，第二个参数为函数运行结果

**返回值**

`Promise<object[]>` - 等待打包的交易数组：数组中的每个交易信息都是 : 

• `hash` 32 字节 - `String`: 交易哈希。
• `nonce` - `Number`: 发送人在此之前进行的交易次数。
• `blockHash` 32 字节 - `String`: 该交易所在区块的区块哈希。 打包中的区块其值为 `null`。
• `blockNumber` - `Number`: 该交易所在区块的区块号。 打包中的区块其值为 `null`。
• `transactionIndex` - `Number`: 该交易在区块中的位置索引。 打包中的区块其值为 `null`。
• `from` - `String`: 交易发送人地址。
• `to` - `String`: 交易接收人地址。 对于合约创建交易其值为``null``
• `value` - `String`: 转账金额。以 wei 为单位。
• `gasPrice` - `String`: 由发送人指定的 gas 价格。以 wei 为单位。
• `gas` - `Number`: 由发送人指定的 gas 数量。
• `input` - `String`: 伴随交易发送的数据。

```jsx
web3.eth.getPendingTransactions().then(console.log);
 >  [
     {
         hash: '0x9fc76417374aa880d4449a1f7f31ec597f00b1f6f3dd2d66f4c9c6c445836d8b',
         nonce: 2,
         blockHash: '0xef95f2f1ed3ca60b048b4bf67cde2195961e0bba6f70bcbea9a2c4e133e34b46',
         blockNumber: 3,
         transactionIndex: 0,
         from: '0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b',
         to: '0x6295ee1b4f6dd65047762f924ecd367c17eabf8f',
         value: '123450000000000000',
         gas: 314159,
         gasPrice: '2000000000000',
         input: '0x57cb2fc4'
         v: '0x3d',
         r: '0xaabc9ddafffb2ae0bac4107697547d22d9383667d9e97f5409dd6881ce08f13f',
         s: '0x69e43116be8f842dcd4a0b2f760043737a59534430b762317db21d9ac8c5034'
     },....,{
         hash: '0x9fc76417374aa880d4449a1f7f31ec597f00b1f6f3dd2d66f4c9c6c445836d8b',
         nonce: 3,
         blockHash: '0xef95f2f1ed3ca60b048b4bf67cde2195961e0bba6f70bcbea9a2c4e133e34b46',
         blockNumber: 4,
         transactionIndex: 0,
         from: '0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b',
         to: '0x6295ee1b4f6dd65047762f924ecd367c17eabf8f',
         value: '123450000000000000',
         gas: 314159,
         gasPrice: '2000000000000',
         input: '0x57cb2fc4'
         v: '0x3d', // 用于 ecrecover 从签名和交易反推出公钥
         r: '0xaabc9ddafffb2ae0bac4107697547d22d9383667d9e97f5409dd6881ce08f13f',
         s: '0x69e43116be8f842dcd4a0b2f760043737a59534430b762317db21d9ac8c5034'
     }
]
```

# ****getTransactionFromBlock 获取区块指定位置索引的交易对象****

> web3.eth.getTransactionFromBlock(hashStringOrNumber, indexNumber, [, callback])

根据区块哈希或区块号，以及交易位置索引获取交易对象。

**参数**

1. 区块号 | 区块哈希 | 预设区块号
2. 交易位置索引
3. 可选的回调函数

**return**

`Promise` 返回 `Object` - 交易对象, 详情请查看 [web3.eth.getTransaction](https://learnblockchain.cn/docs/web3.js/web3-eth.html#eth-gettransaction-return):

```jsx
var transaction = web3.eth.getTransactionFromBlock('0x4534534534', 2)
.then(console.log);
```

# ****getTransactionReceipt 根据交易 hash 返回交易收据****

> web3.eth.getTransactionReceipt(hash [, callback])

**参数**

1. **交易哈希**
2. 可选的回调函数

**return**

`Promise` 返回 `Object` - 交易收据对象，未能找到交易收据时返回 `null` ：

- status — `Boolean` : 若交易成功其值为 `TRUE` , 如果该交易被 EVM `Revert`,  其值为 `FALSE`.
- blockHash 32 字节 — `String` : 该交易所在区块的区块哈希值
- blockNumber — `Number` : 交易所在区块的区块号
- transactionHash 32 字节 — `String` : 交易哈希
- transactionIndex — `Number` : 交易在区块中的位置索引.
- from — `String` : 交易发起人地址
- to — `String` : 交易接收人地址 . 合约创建交易其值为 null .
- contractAddress — `String` : 如果指定交易为创建合约交易, 则这个值就是新合约的地址, 否则为 null .
- cumulativeGasUsed — `Number` : 该交易执行时其所在区块已经累计消耗的 gas 量.
- gasUsed — `Number` : 该交易本身所消耗的 gas 量.
- logs — Array : 该交易所生成的日志对象.

```jsx
var receipt = web3.eth.getTransactionReceipt('0x9fc76417374aa880d4449a1f7f31ec597f00b1f6f3dd2d66f4c9c6c445836d8b')
.then(console.log);
```

```jsx
> {
  "status": true,
  "transactionHash": "0x9fc76417374aa880d4449a1f7f31ec597f00b1f6f3dd2d66f4c9c6c445836d8b",
  "transactionIndex": 0,
  "blockHash": "0xef95f2f1ed3ca60b048b4bf67cde2195961e0bba6f70bcbea9a2c4e133e34b46", // 这笔交易在哪个区块中
  "blockNumber": 3, // 位于区块的位置索引 , 为第 4 笔交易
  "contractAddress": "0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe", // 该笔交易为创建合约地址, 这里存储了那个合约的地址
  "cumulativeGasUsed": 314159, // 在该交易执行时其所在区块已经累积消耗的 gas 量
  "gasUsed": 30234, // 这笔交易使用的 gas 量
  "logs": [{
         // getPastLogs 等返回的日志对象
     }, ...]
}
```

# ****getTransactionCount 获取指定以太坊地址发送的交易数量****

> web3.eth.getTransactionCount(address [, defaultBlock] [, callback])

**参数**

1. 要获取发送交易数的地址
2. 区块标识信息 , 截止到这个区块, 指定地址发出的交易数量
3. 可选的回调函数

**返回值**

`Promise` 返回 `Number` - 从给定地址发出的交易数量。

```jsx
web3.eth.getTransactionCount("0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe") 
.then(console.log);
> 1
```

截止到 web3.eth.defaultBlock 区块 , 地址为 0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe 发送了多少笔交易 (转账交易 |  创建合约交易) . 

# ****sendTransaction 将交易发布到网络中****

> web3.eth.sendTransaction(transactionObject, [, callback])

**参数**

1. `Object` — 要发送的交易对象
	1. from — `String` | `Number` : 发送账户地址 . 如果没有指定 , 则使用 `web3.eth.defaultAccount` 属性值. 或者在 `web3.eth.accounts.wallet` 中的本地钱包地址。
	2. to — `String` : 可选的交易消息的目标地址 , 对于合约创建交易来说其值为空.
	3. value — `Nubmer | String | BN | BigNumber` : 可选的交易转账金额 , wei . 这是合约创建交易的初始转账. 
	4. gas — `Number` 可选的交易可用的 gas 量
	5. gasPrice — `Nubmer | String | BN | BigNumber` 可选的交易可用的 gas 价格 , 默认值通过 `web3.eth.gasPrice` 获得 .
	6. data — `String` : 可选的包含合约函数调用数据的 ABI 字节字符串 , 对合约创建交易来说 ,其值为合约的初始化代码.
	7. nonce — `Number` : 可选的使用同样的 nonce 值可以覆盖处理中的交易. 
	8. chain — `String` : 可选地, 默认为 mainnet , 也可以选择其他测试网络.
	9. hardfork — `String` : 默认为圣彼得堡(`petersburg`)分叉, 也可以选择拜占庭分叉等.
	10. common — Object : 可选的通用对象
		1. customChain — `Object` : 自定义链属性
			1. name 可选地链名称
			2. networkId 自定义的网络 ID
			3. chainId 自定义的链 ID
		2. baseChain — `String` : mainnet | goerli | rinkeby | ropsten 
		3. hardfork — 自定义链的硬分叉版本
2. callback — Function 可选地回调函数 (error , handle)

<aside>
💡 from 属性可以是个地址或者 web3.eth.accounts.wallet 的索引值。 随后可以在本地通过该账户对应的私钥签名并通过 web3.eth.sendSignedTransaction() 发送交易。 


如果 chain、 hardfork 或 common 这些属性值都没有设置, Web3 会尝试通过网络查询相应的网络 ID 和链 ID 并设置它们。

</aside>

**返回值**

该 **回调** 会返回 32 字节交易哈希。

- `PromiEvent`(handle) : 一个整合事件发生器的 promise 对象, 将在收到交易数据 receipt 后得到解析 . (await getTransactionReceipt())  有以下事件 (`Event`)可用 :
	- transactionHash : 返回 String . 在交易发出并得到有效的交易哈希后立刻触发.
	- receipt : 返回 Object : 当收到交易收据后立即触发.
	- confirmation 返回 `Number` : `Object` , 每次区块确认后立刻触发, 最多 12 次确认 . 确认编号为第一个参数, 收据 receipt 为第二个参数 . 从交易所在区块被挖到的 0 号确认开始触发.
- error : 返回 Error and Object | undefined : 在发送交易的过程中如果出现错误则立刻触发. 如果交易被网络拒绝时附带有交易数据, 则第二个参数为交易收据.

```jsx
// 通过 https://remix.ethereum.org 编译的 solidity 源码
var code = "603d80600c6000396000f3007c01000000000000000000000000000000000000000000000000000000006000350463c6888fa18114602d57005b6007600435028060005260206000f3";

// 使用回调
web3.eth.sendTransaction({
	from: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe',
	data: code  // 部署合约
}, function{error, hash){ 
	...
});

// 使用 Promise
web3.eth.sendTransaction({
	from: "0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe",
	to: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe',
	value: '1000000000000000'
})
.then(function(receipt) {
	console.log(receipt);
});

// 使用事件发生器
web3.eth.sendTransaction({
		from: "0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe",
		to: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe',
		value: '1000000000000000'
})
.on('transactionHash', function(hash)) {
	...
})
.on('receipt', function(receipt) {
	...
})
.on('confirmation', function(confirmationNumber, receipt) {
	...
})
.on('error', console.error); // 如果是 out of gas 错误, 则第二个参数为 receipt
```

事件发生器就类似于 golang 中的 for select case . 只会选择一个路径执行. 

# ****sendSignedTransaction****

> web3.eth.sendSignedTransaction(signedTransactionData [, callback])

发送已经经过签名的交易 , 交易签名可以通过 `web3.eth.accounts.signTransaction` 生成. 

**参数**

1. 16 进制格式的签名交易数据
2. Function 可选的回调函数

**返回值**

一个整合事件的 promise 对象 , 将在收到交易收据 receipt 后得到解析. 

<aside>
😈 1. 新建一个以太坊交易类 ethereum-tx 
2. 解析原有私钥为 hex 进制字节数组形式
3. 构造一笔原始的合约交易 , data 字段为编译后的字节数据
4. 根据原始交易新建一笔交易, 指定链
5. 使用私钥作为参数调用 tx.sign 对交易进行签名
6. 对签名后的交易进行序列化
7. 将经过签名的交易发布到网络中 , 使用事件发生器 或者 promise 处理返回的结果.


</aside>

```jsx
var Tx = require('ethereum-tx').Transaction; // 以太坊交易类
// 获取 16 进制格式的私钥数据
var privateKey = Buffer.from('e331b6d69882b4cb4ea581d88e0b604039a3de5967688d3dcffdd2270c0fd109', 'hex');

var rawTx = {
	nonce: '0x00',
	gasPrice: '0x09184e72a000',
	gasLimit: '0x2710',
	to: '0x0000000000000000000000000000000000000000',
	value: '0x00',
	data: '0x7f7465737432000000000000000000000000000000000000000000000000000000600057'
	// 对于创建合约的交易 , data 字段值就是合约代码经过 solidity 编译后的 hex 字节数组值
}

// 新建交易, 指定所在链
var tx = new Tx(rawTx, {'chain': 'ropsten'});
// 对交易进行签名
tx.sign(privateKey); 

// 对签名后的交易进行序列化
var serializedTx = tx.serialize();

// console.log(serializeTx.toString('hex'));
//0xf889808609184e72a00082271094000000000000000000000000000000000000000080a47f74657374320000000000000000000000000000000000000000000000000000006000571ca08a8bbf888cfa37bbf0bb965423625641fc956967b81d12e23709cead01446075a01ce999b56a8a88504be365442ea61239198e23d1fce7d00fcfc5cd3b44b7215f

// 使用事件发生器
web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
.on('receipt', console.log);
```

<aside>
💡 在使用 2.0.0 版本的 ethereumjs-tx 包时, 如果我们不指定参数 chain, 默认会使用 mainnet， 如果你要使用其它网络， 需要通过 chain 参数来指定。


</aside>

# ****sign 使用指定账户对任意数据进行签名 (账户需提前解锁)****

**参数**

1. dataToSign : `String` — 待签名数据 . 对于字符串需要先用 web3.utils.utf8ToHex 将其转换为 16 进制数据.
2. address : `String` | `Number` : 用来签名的账户地址 , 可以直接指定地址, 也可以使用本地钱包 web3.eth.accounts.wallet 中的地址或索引 . 
3. 回调函数

<aside>
💡 `address` 参数也可以是钱包 web3.eth.accounts.wallet 中的地址或索引。 随后可以使用该账户对应的本地私钥进行签名。


</aside>

**返回值**

`Promise` 返回 `String` - 签名。

```jsx
web3.eth.sign("Hello World", "0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe")
.then(console.log);

> "0x30755ed65396facf86c53e6217c52b4daebe72aa4941d89635409de4c9c7f9466d4e9aaec7977f05e923889b33c0d0dd27d7226b6e6f56ce737465c5cfd04be400"

web3.eth.sign(web3.utils.utf8ToHex("Hello World"), '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe')
.then(console.log);

> "0x30755ed65396facf86c53e6217c52b4daebe72aa4941d89635409de4c9c7f9466d4e9aaec7977f05e923889b33c0d0dd27d7226b6e6f56ce737465c5cfd04be400"
```

# ****signTransaction 签名交易 (提前解锁账户)****

和 sign 方法不同, 该方法专门用于签名交易, 在签名时需要提前解锁账户来授权签名. 

**参数**

1. Object — 待签名的交易数据. (格式如 sendTransaction 方法中那样 )
2. String — 签名交易所用的账户地址
3. Funciton — 回调函数 

**return**

`Promise` 返回 `Object` - RLP 编码的交易。

`raw` 属性可以用来通过 [web3.eth.sendSignedTransaction](https://learnblockchain.cn/docs/web3.js/web3-eth.html#eth-sendsignedtransaction) 来发送交易。

```jsx
web3.eth.signTransaction({
	from: '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0',
	gasPrice: '20000000000',
	gas: '21000',
	to: '0x3535353535353535353535353535353535353535',
	value: '1000000000000000000',
	data: ''
})
.then(console.log);

> {
    raw: '0xf86c808504a817c800825208943535353535353535353535353535353535353535880de0b6b3a76400008025a04f4c17305743700648bc4f6cd3038ec6f6af0df73e31757007b7f59df7bee88da07e1941b264348e80c78c4027afc65a87b0a5e43e86742b8ca0823584c6788fd0',
    tx: {
        nonce: '0x0',
        gasPrice: '0x4a817c800',
        gas: '0x5208',
        to: '0x3535353535353535353535353535353535353535',
        value: '0xde0b6b3a7640000',
        input: '0x',
        v: '0x25',
        r: '0x4f4c17305743700648bc4f6cd3038ec6f6af0df73e31757007b7f59df7bee88d',
        s: '0x7e1941b264348e80c78c4027afc65a87b0a5e43e86742b8ca0823584c6788fd0',
        hash: '0xda3be87732110de6c1354c83770aae630ede9ac308d9f7b399ecfba23d923384'
    }
}
```

# call 执行一个消息调用交易

执行一个消息调用交易 , 消息调用交易直接在节点的 VM 中而不需要通过区块链挖矿来执行.

**参数**

1. Object — 交易对象, 相关信息可以查看 [web3.eth.sendTransaction](https://learnblockchain.cn/docs/web3.js/web3-eth.html#eth-sendtransaction-return), . 消息调用交易和一般交易的区别是 from 属性也是可选的.  

<aside>
😈 sendTransaction 将交易发布到比特币网络上, 通过区块链挖矿来执行 . 
而 call 消息调用交易无需发布到区块链上, 而是直接在节点的 VM 中执行.


</aside>

1. Function — 可选的回调函数

**return**

`Promise` 返回 `String`: 消息调用的返回数据, 比如合约函数的返回值。

```jsx
web3.eth.call({
	to: "0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe", // 合约地址
	data: "0xc6888fa10000000000000000000000000000000000000000000000000000000000000003"
})
.then(console.log);

> "0x000000000000000000000000000000000000000000000000000000000000000a"
```

# ****estimateGas 通过执行消息调用得到交易的 gas 用量****

> web3.eth.estimateGas(callObject [, callback])

通过执行消息调用来得到交易的 gas 用量

起始 callObject 中的字段可以是 sendTransaction 交易中的所有字段

- from
- to
- value
- data
- …

**参数**

1. Object — 交易对象 , 相关信息可以查看 web3.eth.sendTransaction  消息调用交易和一般交易的区别是 from 属性也是可选的
2. Function — 可选的回调函数

**return**

`Promise` 返回 `Number` - 模拟消息或交易调用的 gas 用量

```jsx
web3.eth.estimateGas({
	to: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe',
	data: '0xc6888fa10000000000000000000000000000000000000000000000000000000000000003'
})
.then(console.log);

> "0x0000000000000000000000000000000000000000000000000000000000000015"
```

# ****getPastLogs 获取匹配给定条件的历史日志****

> web3.eth.getPastLogs(options [, callback])

**参数**

1. Object — 过滤器对象  (Bloom filter布隆过滤器)
	1. fromBlock — `Number | String` : 起始区块号 | 预设区块号
	2. toBlock — `Number | String` : 终止区块号 | 预设区块号
	3. address — `String | Array` : 获取一个或多个相关地址的日志
	4. topics — Array : 必须出现在日志项中的主题值(topic)数组 . (顺序很重要) 可以使用 null 值来忽略某个 topic . e.g. [null, ‘0x12…’] . 也可以通过一个数组来指定该主题关联的一系列属性 e.g. `[null, [’option1’, ‘option2’]]`

**return**

`Promise` 返回 `Array` - 日志对象数组。

数组中的`事件对象`结构如下：

- address — String : 事件发生源地址
- data — String : 包含未索引的日志参数
- topics — Array : 包含最多 4 个 32 字节 topic 的数组 , 主题 1- 3 包含日志的索引参数.
- logIndex — Number : 事件在块中的索引位置 (`todo`应该指的是在Receipt.logs 中的位置).
- transactionIndex — Number : 创建事件的交易的索引位置
- transactionHash — String : 创建事件的交易的 hash 值
- blockHash — String : 创建事件的块的 hash 值, 若处于 pending 状态, 其值为 null.
- blockNumber — Number : 创建事件的块编号, 处于 pending 状态时其值为 null.

```jsx
web3.eth.getPastLogs({
	address: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe',
	topics: '0x033456732123ffff2342342dd12342434324234234fd234fd23fd4f23d4234'
})
.then(console.log);

[
	{
    data: '0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385',
    topics: ['0xfd43ade1c09fade1c0d57a7af66ab4ead7c2c2eb7b11a91ffdd57a7af66ab4ead7', '0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385']
    logIndex: 0,
    transactionIndex: 0,
    transactionHash: '0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385',
    blockHash: '0xfd43ade1c09fade1c0d57a7af66ab4ead7c2c2eb7b11a91ffdd57a7af66ab4ead7',
    blockNumber: 1234,
    address: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe'
	},
	{...}
]
```

# ****getWork 矿工需要满足的挖矿条件****

获取矿工要满足的挖矿条件。返回当前区块的哈希，种子哈希以及要满足的边界条件（”目标值” target）。

**参数**

1. `Function` — 可选地回调函数

**return**

`Promise` 返回 `Array` - 具有以下结构的挖矿条件:

- `String` 32 字节 - 于 **索引位置 0**: 当前区块头工作量证明哈希。
- `String` 32 字节 - 于 **索引位置 1**: 用于 DAG 的种子哈希。
- `String` 32 字节 - 于 **索引位置 2**: 边界条件 (“目标值”), 2^256 / 难度.

```jsx
web3.eth.getWork()
.then(console.log);

> [
  "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef", // current blockhash
  "0x5EED00000000000000000000000000005EED0000000000000000000000000000", // DAG 种子 hash
  "0xd1ff1c01710000000000000000000000d1ff1c01710000000000000000000000" // target
]
```

# ****submitWork 提交一个工作证明解决方案****

**参数**

1. `String` 8 Bytes: 找到的 nonce 值 (64 位)
2. `String` 32 字节: 区块头的工作量证明哈希 (256 位)
3. `String` 32 字节: The mix digest (256 位)
4. `Function` - (可选) 可选的回调函数，其第一个参数为错误对象，第二个参数为函数运行结果。

**返回值**

`Promise` 返回 `Boolean` - 如果提交的方案有效返回 `TRUE`，否则返回 false。

该方法将会验证提交方案的有效性 , 如果有效, 则返回 TRUE

```jsx
web3.eth.submitWork([
	"0x0000000000000001", // nonce
  "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef", // pow hash
  "0xD1FE5700000000000000000000000000D1FE5700000000000000000000000000" // mix digest
])
.then(console.log);

> true
```

# ****requestAccounts 请求/启动账户****

<aside>
😈 该方法将从当前运行环境（Metamask，Status 或 Mist）中请求/启用帐户。 如果你使用默认的 Web3.js provider (WebsocketProvider, HttpProvidder and IpcProvider) 连接节点，则该方法不起作用。 


该方法只在你使用像 Status, Mist or Metamask 这些应用的嵌入式 provider 时才有效。

</aside>

****参数****

1. `Function` - (可选) 可选的回调函数，其第一个参数为错误对象，第二个参数为函数运行结果。

### **返回值**

`Promise<Array>` - 返回所启用账户数组。

```jsx
web3.eth.requestAccounts().then(console.log);

> ['0aae0B295369a9FD31d5F28D9Ec85E40f4cb692BAf', '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe']
```

# ****getChainId 获取当前链的 ID****

> web3.eth.getChainId([callback]);

返回当前所连接节点的链 ID，如 [EIP-695](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-695.md) 所述。

### **返回值**

`Promise<Number>` - 返回链 ID。

```jsx
web3.eth.getChainId().then(console.log);

> 61
```

# ****getNodeInfo 获取当前节点信息****

> web3.eth.getNodeInfo([callback])

### **返回值**

`Promise<String>` - 当前客户端版本。

```jsx
web3.eth.getNodeInfo().then(cosole.log);

> "Mist/v0.9.3/darwin/go1.4.1"
```

# ****getProof 返回 Merkle 证明****

<aside>
😈 轻节点向全节点请求 Merkle 证明


</aside>

```jsx
web3.eth.getProof(address, storageKey, blockNumber, [callback]);
```

返回账户及相关存储数据，包括 [EIP-1186](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1186.md) 所描述的默克尔证明。

**参数**

1. `String` 20 字节 : 账户或合约地址
2. `Number[] | BigNumber[] | BN[] | String[]` : 应该被证明和包含的存储键值数组. (web3.eth.getStorageAt) 和比特币的 merkle 树不同, 以太坊的数据是存储在某个 slot 中的 , 所以我们需要根据 key 寻找存储位置是否存在该 key 对应的值.
3. `Number | String | BN | BigNumber`: 区块号 | 预定义区块号 `"latest"`, `"earliest"`, and `"genesis"` 。
4. `Function` - (可选) 可选的回调函数，其第一个参数为错误对象，第二个参数为函数运行结果。

**返回值**

`Promise<Object>` - A account object.

- address — String : 账户地址
- balance — String 账户余额 .
- codeHash — String : 账户关联代码的哈希值 . 对于没有代码的一般账户会返回默认 hash 值 ‘0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470’
- nonce — String 账户的 nonc 值
- storageHash — String : 存储树的根 hash 值 , 所有存储将由此根哈希开始提供 merkle proof .
- `accountProof` - `String[]`: rlp 编码序列化的默克尔节点数组，从状态根节点开始，接着是以 SHA3 (地址) 为键值的路径。
- **`storageProof` - `Object[]` 请求的存储条目数组。**`key` - `String` 请求的存储键值。`value` - `String` 存储数据。

```jsx
web3.eth.getProof(
    "0x1234567890123456789012345678901234567890",
    ["0x0000000000000000000000000000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000000000000000000000000001"],
    "latest"
).then(console.log);
> {
    "address": "0x1234567890123456789012345678901234567890",
    "accountProof": [ 
        "0xf90211a090dcaf88c40c7bbc95a912cbdde67c175767b31173df9ee4b0d733bfdd511c43a0babe369f6b12092f49181ae04ca173fb68d1a5456f18d20fa32cba73954052bda0473ecf8a7e36a829e75039a3b055e51b8332cbf03324ab4af2066bbd6fbf0021a0bbda34753d7aa6c38e603f360244e8f59611921d9e1f128372fec0d586d4f9e0a04e44caecff45c9891f74f6a2156735886eedf6f1a733628ebc802ec79d844648a0a5f3f2f7542148c973977c8a1e154c4300fec92f755f7846f1b734d3ab1d90e7a0e823850f50bf72baae9d1733a36a444ab65d0a6faaba404f0583ce0ca4dad92da0f7a00cbe7d4b30b11faea3ae61b7f1f2b315b61d9f6bd68bfe587ad0eeceb721a07117ef9fc932f1a88e908eaead8565c19b5645dc9e5b1b6e841c5edbdfd71681a069eb2de283f32c11f859d7bcf93da23990d3e662935ed4d6b39ce3673ec84472a0203d26456312bbc4da5cd293b75b840fc5045e493d6f904d180823ec22bfed8ea09287b5c21f2254af4e64fca76acc5cd87399c7f1ede818db4326c98ce2dc2208a06fc2d754e304c48ce6a517753c62b1a9c1d5925b89707486d7fc08919e0a94eca07b1c54f15e299bd58bdfef9741538c7828b5d7d11a489f9c20d052b3471df475a051f9dd3739a927c89e357580a4c97b40234aa01ed3d5e0390dc982a7975880a0a089d613f26159af43616fd9455bb461f4869bfede26f2130835ed067a8b967bfb80",
        "0xf90211a0395d87a95873cd98c21cf1df9421af03f7247880a2554e20738eec2c7507a494a0bcf6546339a1e7e14eb8fb572a968d217d2a0d1f3bc4257b22ef5333e9e4433ca012ae12498af8b2752c99efce07f3feef8ec910493be749acd63822c3558e6671a0dbf51303afdc36fc0c2d68a9bb05dab4f4917e7531e4a37ab0a153472d1b86e2a0ae90b50f067d9a2244e3d975233c0a0558c39ee152969f6678790abf773a9621a01d65cd682cc1be7c5e38d8da5c942e0a73eeaef10f387340a40a106699d494c3a06163b53d956c55544390c13634ea9aa75309f4fd866f312586942daf0f60fb37a058a52c1e858b1382a8893eb9c1f111f266eb9e21e6137aff0dddea243a567000a037b4b100761e02de63ea5f1fcfcf43e81a372dafb4419d126342136d329b7a7ba032472415864b08f808ba4374092003c8d7c40a9f7f9fe9cc8291f62538e1cc14a074e238ff5ec96b810364515551344100138916594d6af966170ff326a092fab0a0d31ac4eef14a79845200a496662e92186ca8b55e29ed0f9f59dbc6b521b116fea090607784fe738458b63c1942bba7c0321ae77e18df4961b2bc66727ea996464ea078f757653c1b63f72aff3dcc3f2a2e4c8cb4a9d36d1117c742833c84e20de994a0f78407de07f4b4cb4f899dfb95eedeb4049aeb5fc1635d65cf2f2f4dfd25d1d7a0862037513ba9d45354dd3e36264aceb2b862ac79d2050f14c95657e43a51b85c80",
        "0xf90171a04ad705ea7bf04339fa36b124fa221379bd5a38ffe9a6112cb2d94be3a437b879a08e45b5f72e8149c01efcb71429841d6a8879d4bbe27335604a5bff8dfdf85dcea00313d9b2f7c03733d6549ea3b810e5262ed844ea12f70993d87d3e0f04e3979ea0b59e3cdd6750fa8b15164612a5cb6567cdfb386d4e0137fccee5f35ab55d0efda0fe6db56e42f2057a071c980a778d9a0b61038f269dd74a0e90155b3f40f14364a08538587f2378a0849f9608942cf481da4120c360f8391bbcc225d811823c6432a026eac94e755534e16f9552e73025d6d9c30d1d7682a4cb5bd7741ddabfd48c50a041557da9a74ca68da793e743e81e2029b2835e1cc16e9e25bd0c1e89d4ccad6980a041dda0a40a21ade3a20fcd1a4abb2a42b74e9a32b02424ff8db4ea708a5e0fb9a09aaf8326a51f613607a8685f57458329b41e938bb761131a5747e066b81a0a16808080a022e6cef138e16d2272ef58434ddf49260dc1de1f8ad6dfca3da5d2a92aaaadc58080",
        "0xf851808080a009833150c367df138f1538689984b8a84fc55692d3d41fe4d1e5720ff5483a6980808080808080808080a0a319c1c415b271afc0adcb664e67738d103ac168e0bc0b7bd2da7966165cb9518080"
        ],
        "balance": 0,
        "codeHash": "0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470",
        "nonce": 0,
        "storageHash": "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",
        "storageProof": [
        {
            "key": "0x0000000000000000000000000000000000000000000000000000000000000000",
            "value": '0',
            "proof": []
        },
        {
            "key": "0x0000000000000000000000000000000000000000000000000000000000000001",
            "value": '0',
            "proof": []
        }
    ]
}
```