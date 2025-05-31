// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "forge-std/Script.sol";
import "../src/EduToken.sol";
import "../src/MockStablecoin.sol";
import "../src/PriceOracle.sol";
import "../src/LendingPlatform.sol";

contract DeployScript is Script {
    function run() external {
        uint256 pk = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(pk);

        // 1. Token 與 Oracle
        EduToken edu = new EduToken();
        MockStablecoin musdt = new MockStablecoin();
        PriceOracle oracle = new PriceOracle();

        // 2. Lending Platform
        LendingPlatform platform = new LendingPlatform(address(edu), address(musdt), address(oracle));

        // 3. 把 mUSDT 的 ownership 交給平台，讓其可自行 mint
        musdt.transferOwnership(address(platform));

        // 4. 測試者獲得些許 EDU & mUSDT
        edu.transfer(msg.sender, 1_000 ether);
        platform.deposit(500 ether); // Demo: 抵押 500 EDU
        platform.borrow(400 ether); // 借 400 mUSDT（80% LTV）

        vm.stopBroadcast();
    }
}
