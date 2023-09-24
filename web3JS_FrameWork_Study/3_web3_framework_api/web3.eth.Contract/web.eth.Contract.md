# web3.eth.Contract

<aside>
😈 const contractName = new web3.eth.Contract(abi, contract_address)


</aside>

`web3.eth.Contract` 对象让你可以轻松地与以太坊区块链上的智能合约进行交互。 

当你创建一个新的合约对象时，只需要指定相应的智能合约 json 接口， web3 就会自动将所有的调用转换为基于 RPC 的底层 ABI 调用。

这使得你可以像 JavaScript 对象一样与智能合约进行交互。