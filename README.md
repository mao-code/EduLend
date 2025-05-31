# EduLend - Mini DeFi Lending Education Platform  

Empowering the Next Generation with DeFi Lending Education
Tech Stack: Solidity, Foundry, React, Web3, ETH

*Collateral = EduToken • Debt = mUSDT • 7 % / month interest*

<div>
<img src="https://img.shields.io/badge/foundry-tested-blue" />
<img src="https://img.shields.io/badge/anvil-local--chain-green" />
</div>

---

## 0 . Prerequisites
| Tool | Version (tested) | Install |
|------|-----------------|---------|
| **Foundry** | `forge 0.2.0` (plus `anvil`, `cast`) | `curl -L https://foundry.paradigm.xyz | bash`<br>`foundryup` |
| **Node.js** | ≥ 16 | <https://nodejs.org> (front-end only) |
| **Git** | any | <https://git-scm.com> |
| **A wallet** | MetaMask or Rabby | Optional, for Web UI demo |

> Foundry bundles three CLIs: **forge** (compile/test/script), **anvil** (local EVM node), **cast** (one-off RPC helper).

---

## 1 . Clone & Install

```bash
git clone https://github.com/your-org/edulend.git
cd edulend/contracts
forge install                # fetch OpenZeppelin & test utils
```

## 2. Start a Local Chain (anvil)
```bash
anvil
```

Anvil prints 20 funded accounts (10 000 ETH each).
Copy the first private key - we'll call it PK_DEPLOYER.

## 3. Environment file
Create .env in the contracts/ folder:
```dotenv
# .env
PRIVATE_KEY=0x<PK_DEPLOYER>         # picked from anvil startup log
RPC_URL=http://localhost:8545       # default anvil endpoint
```

## 4. Compile & Run Tests
```bash
forge build       # compile only
forge test -vv    # run all unit tests (src + test)
```
You should see all tests in test/ pass.

## 5. Deploy Contracts Locally
```bash
forge script script/Deploy.s.sol:DeployScript \
  --rpc-url $RPC_URL --broadcast -vv
```

Outputs will be like:
```
Deployed EduToken      : 0x1...EDU
Deployed MockStablecoin: 0x2...USD
Deployed PriceOracle   : 0x3...ORC
Deployed LendingPlatform : 0x4...LEN
```

Copy those addresses for your UI (frontend).