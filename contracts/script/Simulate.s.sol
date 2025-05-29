// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "forge-std/Script.sol";
import "../src/EduToken.sol";

/// @notice 模擬五天內 EDU 的交易行為與價格變化（使用 AMM 曲線）
contract Simulate is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // 初始化 EduToken（1 ETH : 1000 EDU 初始儲備）
        EduToken edu = new EduToken();

        int256[5] memory netChanges = [
            int256(210 ether),    // Day 1：賣出 210 EDU
            int256(-19 ether),    // Day 2：買回 19 EDU
            int256(229 ether),    // Day 3：賣出 230 EDU
            int256(-39 ether),    // Day 4：買回 40 EDU
            int256(249 ether)     // Day 5：賣出 250 EDU
        ];
        uint256 initPrice = edu.currentPrice();
        uint256 liquidationThreshold = (initPrice * 80) / 100;

        for (uint256 day = 0; day < 5; day++) {
            int256 delta = netChanges[day];

            if (delta > 0) {
                // 預估成本，略微高估保證買入成功（不精準但展示用足夠）
                uint256 cost = edu.reserveETH() * uint256(delta) / (edu.reserveEDU() - uint256(delta));
                edu.buy{value: cost}(uint256(delta));
            } else if (delta < 0) {
                edu.sell(uint256(-delta));
            }

            uint256 price = edu.currentPrice();
            console.log("Day %s: Price = %s wei", day + 1, price);

            if (price < liquidationThreshold) {
                console.log("\u274c Liquidation threshold breached at Day %s. Price: %s", day + 1, price);
            }
        }

        vm.stopBroadcast();
    }
}
