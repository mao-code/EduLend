// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract PriceOracle {
    uint256[] public prices;
    uint256 public idx;

    /// @notice 使用經 x*y=k bonding curve 計算出的價格軌跡，單位為 mUSDT/EDU
    constructor() {
        prices = new uint256[](5);

        // 假設 1 ETH = 2000 mUSDT，將 ETH 價格換算為 mUSDT 價格
        // 前 4 天價格 ≥ 80%，第 5 天跌破 80%（以 0.001 ETH = 2.0 mUSDT 作基準）
        prices[0] = 1652892561983471074; // 1.652892561983471074 mUSDT/EDU
        prices[1] = 1388888888888888889; // 1.388888888888888889 mUSDT/EDU
        prices[2] = 1183431952662721893; // 1.183431952662721893 mUSDT/EDU
        prices[3] = 1020408163265306122; // 1.020408163265306122 mUSDT/EDU
        prices[4] = 888888888888888889; // 0.888888888888888889 mUSDT/EDU
        idx = 0;
    }

    function getPrice() external view returns (uint256) {
        return prices[idx];
    }

    function advance() external {
        idx = (idx + 1) % prices.length;
    }
}
