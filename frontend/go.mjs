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
const address = deployment.default.transactions[0].contractAddress;
console.log("Contract address:", address);

fs.writeFileSync(
  path.join(__dirname, './src/abi/LendingPlatform-abi.json'),
  JSON.stringify(abi, null, 2)
);

fs.writeFileSync(
  path.join(__dirname, './src/abi/LendingPlatform-addr.json'),
  JSON.stringify({ address }, null, 2)
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