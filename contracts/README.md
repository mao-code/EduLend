## Foundry

**Foundry is a blazing fast, portable and modular toolkit for Ethereum application development written in Rust.**

Foundry consists of:

-   **Forge**: Ethereum testing framework (like Truffle, Hardhat and DappTools).
-   **Cast**: Swiss army knife for interacting with EVM smart contracts, sending transactions and getting chain data.
-   **Anvil**: Local Ethereum node, akin to Ganache, Hardhat Network.
-   **Chisel**: Fast, utilitarian, and verbose solidity REPL.

## Documentation

https://book.getfoundry.sh/

## Usage

### Build

```shell
$ forge build
```

### Test

```shell
$ forge test
```

### Format

```shell
$ forge fmt
```

### Gas Snapshots

```shell
$ forge snapshot
```

### Anvil

```shell
$ anvil
```

### Deploy

```shell
$ forge script script/Counter.s.sol:CounterScript --rpc-url <your_rpc_url> --private-key <your_private_key>
```

### Cast

```shell
$ cast <subcommand>
```

### Help

```shell
$ forge --help
$ anvil --help
$ cast --help
```

## 📘 專有名詞解釋

| 名詞 | 說明 |
|------|------|
| **ABI** | Application Binary Interface，定義合約函式與事件格式，讓前端可互動。 |
| **external** | Solidity 函式修飾詞，表示該函式只能被外部呼叫，適合與前端串接。 |
| **LTV** | Loan-To-Value，貸款價值比 = 借款金額 ÷ 抵押品價值，過高會觸發清算。 |
| **Chainlink Price Feed** | 去中心化價格預言機，用於取得如 ETH/USD 的市場價格。 |
| **liquidation** | 清算機制，當用戶 LTV 過高時，任何人可清算其債務並獲取抵押品。 |
| **OpenZeppelin v5** | 安全的合約函式庫，提供 IERC20 標準與 SafeERC20 安全包裝器。 |
| **ReentrancyGuard** | 防止重入攻擊的安全保護機制，常搭配 `nonReentrant` 使用。 |
| **unchecked for-loop** | 在確保安全下省略 overflow 檢查以節省 gas 的寫法，常用於迴圈中。 |
