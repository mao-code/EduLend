import fs from 'fs';
import path from 'path';
import { dirname } from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const lendingPlatformJson = await import('/Users/hsing/EduLend/contracts/out/LendingPlatform.sol/LendingPlatform.json', {
  with: { type: 'json' }
});
const abi = lendingPlatformJson.default.abi;
console.log("Contract ABI loaded successfully");

const deployment = await import('/Users/hsing/EduLend/contracts/broadcast/Deploy.s.sol/31337/run-latest.json', {
  with: { type: 'json' }
});
const lendingPlatformAddress = deployment.default.transactions.find(
  tx => tx.contractName === 'LendingPlatform'
).contractAddress;
console.log("Contract address:", lendingPlatformAddress);

fs.writeFileSync(
  path.join(__dirname, './src/abi/LendingPlatform-abi.json'),
  JSON.stringify(abi, null, 2)
);

fs.writeFileSync(
  path.join(__dirname, './src/abi/LendingPlatform-addr.json'),
  JSON.stringify({ address: lendingPlatformAddress }, null, 2)
);

const EduTokenJson = await import('/Users/hsing/EduLend/contracts/out/EduToken.sol/EduToken.json', {
  with: { type: 'json' }
});
const eduTokenAbi = EduTokenJson.default.abi;
console.log("Contract ABI loaded successfully");

fs.writeFileSync(
  path.join(__dirname, './src/abi/EduToken-abi.json'),
  JSON.stringify(eduTokenAbi, null, 2)
);

const PriceOracleJson = await import('/Users/hsing/EduLend/contracts/out/PriceOracle.sol/PriceOracle.json', {
  with: { type: 'json' }
});
const priceOracleAbi = PriceOracleJson.default.abi;
console.log("Contract ABI loaded successfully");

const priceOracleAddress = deployment.default.transactions.find(
  tx => tx.contractName === 'PriceOracle'
).contractAddress;

fs.writeFileSync(
  path.join(__dirname, './src/abi/PriceOracle-abi.json'),
  JSON.stringify(priceOracleAbi, null, 2)
);
fs.writeFileSync(
  path.join(__dirname, './src/abi/PriceOracle-addr.json'),
  JSON.stringify({ address: priceOracleAddress }, null, 2)
);