// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "forge-std/Script.sol";
import "../src/EduToken.sol";
import "../src/MockStablecoin.sol";
import "../src/PriceOracle.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Deploy EduToken
        EduToken eduToken = new EduToken();

        // Deploy MockStablecoin
        MockStablecoin mockStablecoin = new MockStablecoin();

        // Deploy PriceOracle (prices are defined in the contract)
        PriceOracle priceOracle = new PriceOracle();

        // Mint initial MockUSDT for testing
        mockStablecoin.mint(msg.sender, 1000000 ether); // 1M MockUSDT

        vm.stopBroadcast();
    }
}
