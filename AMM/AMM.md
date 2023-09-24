# AMM

# 订单薄

卖单 sell (挂单的订单叫做 Maker, 给交易池提供了更高的流动性)

买单 buy (购买被人订单,吃掉别人订单叫做 Taker)

撮合机制

![Untitled](https://cdn.jsdelivr.net/gh/1055373165/image@main/Untitled.png)

# Maker/Taker

![Untitled](https://cdn.jsdelivr.net/gh/1055373165/image@main/Untitled%201.png)

# depth graph 深度图

左边是卖单, 横轴表示挂单的价格

右边是买单, 横轴表示挂单的价格

idex 使用智能合约的方式

1. 贵 (与智能合约交互, 交易费用高) 每次挂单和买单的价格 0.2usd
2. 慢 (受限于区块出块速度, 最少等待 15s 以上, 取决于消耗的 gas)
3. 深度不足

![Untitled](https://cdn.jsdelivr.net/gh/1055373165/image@main/Untitled%202.png)

**基于订单薄的中心化交易所**

<aside>
😈 1. 费用高：0.2usd/tx
2. 速度慢：挂单要等待 15s 以上，如果交易费不足，可能会更长
3. 深度不足，成交量少


</aside>

# 自动做市商

没有订单薄这个概念的, 引入了流动性池的概念. `Liquidity Pool`

![Untitled](https://cdn.jsdelivr.net/gh/1055373165/image@main/Untitled%203.png)

将 usdc存入流动性池，按照一定比例取出 eth

## 关键公式

<aside>
😈 $x * y = k$


</aside>

# 计算兑换代币数量

在一个常数为 k 的流动性池中, 假设拥有两种代币 x 和 y. 此时满足 $x * y = k$, 在这种情况下, 如果我们充入 ∆x 个代币可以兑换多少个 y 代币?  

<aside>
😈 $(x+∆x) *  (y-∆y) = k$


</aside>

∆y 就是兑换的 y 代币的数量, 其公式为 : 

$∆y = y - \frac{k}{x+∆x}$

![Untitled](https://cdn.jsdelivr.net/gh/1055373165/image@main/Untitled%204.png)

滑点达到 10% , 主要是因为流动性池中的流动性不足.

<aside>
😈 根据公式可以理解, 因为交易者存入了 DAI, 买出了 eth, 流动性池中的 eth 相对于 dai 减少了, 那么购买时以太的价格就增加了.


</aside>

# 代币价格计算

<aside>
😈 一个代币相对于另一个代币的价格.
计算的是流动性池中, 两种代币的存储比例. 比如 DAI 5000 个, ETH 10 个, 那么 DAI 的价格就是 0.002 eth (DAI 的价格是相对于另一种代币而言的) , 同理, ETH 的价格为 500 DAI


</aside>

|           | A              | B              |
| --------- | -------------- | -------------- |
| 数量      | x              | y              |
| x相对价格 | $\frac{y}{x}B$ | $\frac{x}{y}A$ |

|          | DAI       | ETH     |
| -------- | --------- | ------- |
| 数量     | 5000      | 10      |
| 相对价格 | 0.002 eth | 500 dai |

## 公式

<aside>
😈 假设当前有一个用户使用 a 代币购买 b 代币, 卖出的 a 代币的数量为 ∆x 得到的 b 代币的数量是 ∆y . 那么此次交易中一个 b 代币的价格


</aside>

$Price_B = \frac{∆x}{∆y}Price_A$

## 价格公式推导

$(x+∆x)*(y+∆y) = xy$

$∆xy - x∆y - ∆x∆y = 0$

$∆xy = (x+∆x)∆y$

$\frac{∆x}{∆y} = \frac{x+∆x}{y}$

<aside>
😈 这个就是交易者获得 b 代币的价格, 从公式可知: 我们往流动性池中存入的代币 a 越多, 代币 b 的价格就越高, 兑换的 b 就越小, 这个是从公式角度分析为什么兑换的代币数量越大, 获得 的代币越少的原因.


当存入的 a 代币数量很小时, b 代币的价格就接近于 x / y , 但是仍然比这个价格略高, 这也是为什么指导价格为 300usdc : 1eth 时, 仅能兑换处 0.9 eth 的原因.

根据极限思想, ∆x = 0 时, b 代币的价格就是  x / y .

</aside>

## 价值公式推导

<aside>
😈 价值 = 价格 * 数量 (Quantities)


</aside>

### 代币 a 的价值 = 代币 a 的价格 * 代币 a 的数量

$Value_a = Price_a * Q_a$

= $\frac{y}{x}(Price_B) * x$

= $yPrice_B$

= $Value_B$ 

<aside>
😈 即两者的总价值是相同的


</aside>

### 考虑手续费 0.3%

$(x+∆x)*(y-∆y) = k$

$(x+∆x-0.003∆x)*(y-∆y) = k$

<aside>
😈 相等于将这笔兑换交易的手续费先放入流动性池中.等流动性提供者撤出流动性时(将∆y发送给用户), 连同本金一起发放给流动性提供者. 而放在流动性池中, 就意味着流动性池中的代币增加了, 导致 k 值缓慢增加.


</aside>

**常数**

<aside>
😈 x * y  = k  


假设流动性池中包含 10eth & 3000 usdc  那么常数 k = 30000

往流动性池中存入 300 usdc 可以取出的以太坊数量：(要保持这个常数不变)
(10-x) * (3000 + 300) = 30000   x= 0.9

</aside>

![Untitled](https://cdn.jsdelivr.net/gh/1055373165/image@main/Untitled%205.png)

![Untitled](https://cdn.jsdelivr.net/gh/1055373165/image@main/Untitled%206.png)

<aside>
😈 其中 300 是充入流动性池中的 usdc 的数量，而 x 是我们可以获得的 eth 的数量；


两者的乘积还是要保持一个常数 30000；

求出的 x 就是我们可以换取的 eth 的数量

从上面知：我们本想使用 300usdc 兑换 1 eth  而现在只能兑换0.9个；

实际价格为 330usdc/eth  (想要兑换的资产越多，兑换价格的其实是越贵的; 存入的资产越多, 兑换的价格实际上越贵）

</aside>

![Untitled](https://cdn.jsdelivr.net/gh/1055373165/image@main/Untitled%207.png)

![Untitled](https://cdn.jsdelivr.net/gh/1055373165/image@main/Untitled%208.png)

![Untitled](https://cdn.jsdelivr.net/gh/1055373165/image@main/Untitled%209.png)

因为坡度是越来越小的，所以充入的越多，换得的 eth 就越少；

因为 usdc 相对于 eth 是更多的, 此时流动性池应该鼓励充入更多的以太坊, 以此保证两者的比例均衡, 即保证流动性. 此时如果我们使用 eth 兑换 usdc 的话, eth 只需要移动一点, 就可以换取更多的 usdc. 

<aside>
😈 注入流动性时，必须充入和原始交易池中相同比例的 usdc 和 eth；


比如 初始比例为 1 ：300 

那么流动性充入时：可以是 1 eth  300 usdc 
或者 2 eth  600 usdc

这样的话就不会影响流动池中的兑换比例

</aside>

## 充入流动性

![Untitled](https://cdn.jsdelivr.net/gh/1055373165/image@main/Untitled%2010.png)

![Untitled](https://cdn.jsdelivr.net/gh/1055373165/image@main/Untitled%2011.png)

<aside>
😈 当流动池中 usdc : eth = 6000:20 时，变动比例


</aside>

<aside>
😈 由于 x 轴增加的比例减少，意味着 y 轴下降的比例也相应减少；虽然 y 轴比例下降，但是下降后的比例还要*2，所以总的来说，流动性池尾 20 : 6000 时，使用 300 usdc 可以兑换更多的 eth；


</aside>

![Untitled](https://cdn.jsdelivr.net/gh/1055373165/image@main/Untitled%2012.png)

# Uniswap

每笔交易0.3% 手续费（给流动性提供者）

```go
300usdc * 0.3% = 0.9 usdc
```

# AMM 优点

## 无限流动性

![Untitled](https://cdn.jsdelivr.net/gh/1055373165/image@main/Untitled%2010.png)

<aside>
😈 这样的曲线不会和 x 轴和 y 轴产生交点，而且很好的平衡了流动性池的代币比例


</aside>

### ethereun total is more

此时再补充 eth 的结果

![Untitled](https://cdn.jsdelivr.net/gh/1055373165/image@main/Untitled%2013.png)

如果补充 usdc

![Untitled](https://cdn.jsdelivr.net/gh/1055373165/image@main/Untitled%2014.png)

<aside>
😈 因此流动性池会一直保证两者代币的比例平衡；


</aside>

### usdc total is more so do it

## 激励散户提供流动性

## 交易场所集中

（马太效应）

机制去中心化，而某些流动性较小的币种会集中在这里；

# AMM缺点

## 无`限价单`

<aside>
😈 假设基于当前以太坊的价格兑换 usdc 的比例为: 300usdc: 1eth
不支持挂一个 250usdc : 1eth 的卖单, 等到达到该价格时自动卖出. 


1. 盯盘
2. 程序化交易

</aside>

## 小额交易手续费贵

（平均 1usd 想要更快：5usd）

## 滑点

区块确认延迟造成的价格出入；

（在等待过程中，突然大批代币提出，那么自己将以特别高的价格购入，造成较大损失）

抽出流动性

在等待过程中, 有人充入了自己充入代币的大流动性, 造成自己的代币只能换取少量的代币.

处理：`容忍度` (tolerance)（1% %2 … 超过这个价格区间就放弃这笔交易）