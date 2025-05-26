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
        prices[0] = 2000000000000000000;  // 2.0000 mUSDT
        prices[1] = 1900000000000000000;  // 1.9000 mUSDT
        prices[2] = 1800000000000000000;  // 1.8000 mUSDT
        prices[3] = 1700000000000000000;  // 1.7000 mUSDT
        prices[4] = 1599999999999999999;  // 1.6000 mUSDT (剛好 < 80%)

        idx = 0;
    }

    function getPrice() external view returns (uint256) {
        return prices[idx];
    }

    function advance() external {
        idx = (idx + 1) % prices.length;
    }
}
