// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "forge-std/Test.sol";
import "../src/PriceOracle.sol";

contract PriceOracleTest is Test {
    PriceOracle oracle;

    function setUp() public {
        oracle = new PriceOracle();
    }

    function testInitialPriceIsCorrect() public {
        uint256 price = oracle.getPrice();
        assertEq(price, 1652892561983471074); // 1.65289...
    }

    function testAdvanceRotatesIndex() public {
        oracle.advance();
        uint256 price = oracle.getPrice();
        assertEq(price, 1388888888888888889); // 1.3888...

        oracle.advance();
        oracle.advance();
        oracle.advance();
        oracle.advance(); // 轉回來

        uint256 rotated = oracle.getPrice();
        assertEq(rotated, 1652892561983471074);
    }
}
