// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract PriceOracle {
    uint256[] public prices;
    uint256 public idx;

    constructor(uint256[] memory _trajectory) {
        prices = _trajectory;
        idx = 0;
    }

    function getPrice() external view returns (uint256) {
        return prices[idx];
    }

    function advance() external {
        idx = (idx + 1) % prices.length;
    }
}
