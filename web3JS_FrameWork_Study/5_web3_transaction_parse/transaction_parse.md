# 交易解析

## 异步调用

异步调用，即通过 `Promise` 对象实现

因为解析交易时需要通过调用合约方法来获取交易数据，而合约方法调用是异步的，所以解析交易时需要使用 `Promise` 对象来处理。

## 交易收据解析

我们常说的交易解析实际上是对交易的收据中的字段进行解析，包括解析交易的 `from`、`to`、`value`、`gas`、`gasPrice`、`input`、`nonce` 等字段。

比如一般我们关心转账事件，它对应的事件签名为 `Transfer(address,address,uint256)`

我们监听到交易收据后取出交易收据的 logs，然后判断 topics[0] 的值（事件类型的签名值）是否和我们想要监听的事件签名值一致，如果是就继续对该交易收据的剩余部分进行解析，否则就跳过处理下一个。

解析 data ，参数为：事件 abi、待解析的数据 data、事件中两个被索引的字段（即 from 和 to）

```jsx
let decodedata = web3.eth.abi.decodeLog(eventAbi, logs[i].data, [logs[i].topics[1], logs[i].topics[2]]);
```

![](/images/2023-09-24-20-59-06.png)