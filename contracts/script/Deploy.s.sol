// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "forge-std/Script.sol";
import "../src/EduToken.sol";
import "../src/MockStablecoin.sol";
import "../src/LendingPlatform.sol";
import "../src/PriceOracle.sol";

contract Deploy is Script {
    function run() external {
        // ✅ 讀取 broadcast 私鑰
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // 1. 部署 EduToken（具 bonding curve）
        EduToken edu = new EduToken(
            "EduToken",
            "EDU",
            1_000_000 ether,  // 初始供給
            1e15,             // 初始價格 P0（0.001 ETH）
            1e12              // 線性斜率 k
        );

        // 2. 部署 MockStablecoin（模擬 USDT）
        MockStablecoin usdt = new MockStablecoin();

        // 3. 部署 LendingPlatform（主流程）
        LendingPlatform platform = new LendingPlatform(
            address(edu),
            address(usdt)
        );

        // 4. 部署 PriceOracle（模擬 5 天價格）
        uint256 ;
        traj[0] = 2000e18;
        traj[1] = 2100e18;
        traj[2] = 1900e18;
        traj[3] = 2050e18;
        traj[4] = 1950e18;

        PriceOracle oracle = new PriceOracle(traj);

        // 初始 mint 測試用 USDT & EDU
        usdt.mint(msg.sender, 100_000 ether);
        edu.mint(msg.sender, 100_000 ether);

        // 顯示合約地址
        console.log("EduToken      :", address(edu));
        console.log("MockUSDT      :", address(usdt));
        console.log("LendingPlatform:", address(platform));
        console.log("PriceOracle   :", address(oracle));

        vm.stopBroadcast();
    }
}
