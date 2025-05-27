// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "forge-std/Test.sol";
import "../src/EduToken.sol";

contract EduTokenTest is Test {
    EduToken edu;
    address user = address(0x1234);

    function setUp() public {
        edu = new EduToken();
        vm.deal(address(this), 10 ether); // 測試帳戶有 10 ETH
    }

    function testInitialPriceInMusdtIsCorrect() public view {
        uint256 price = edu.currentPriceInMusdt();
        assertEq(price, 2 ether); // 2.0 mUSDT = 2 * 1e18
    }

    function testBuyEduIncreasesPrice() public {
        uint256 initialPrice = edu.currentPriceInMusdt();

        uint256 amount = 100 ether; // 要買 100 EDU
        uint256 cost = edu.getEthRequiredToBuy(amount);
        edu.buy{value: cost}(amount);

        uint256 newPrice = edu.currentPriceInMusdt();
        assertGt(newPrice, initialPrice);
    }

    function testSellEduDecreasesPrice() public {
        vm.deal(user, 10 ether);
        vm.startPrank(user);

        uint256 buyAmount = 100 ether;
        uint256 cost = edu.getEthRequiredToBuy(buyAmount);
        edu.buy{value: cost}(buyAmount);

        uint256 priceAfterBuy = edu.currentPriceInMusdt();

        edu.sell(buyAmount);

        uint256 priceAfterSell = edu.currentPriceInMusdt();
        assertLt(priceAfterSell, priceAfterBuy);

        vm.stopPrank();
    }

    function testExchangeRateUpdate() public {
        uint256 newRate = 3000e18;
        edu.setExchangeRate(newRate);
        assertEq(edu.ethToMusdt(), newRate);
    }
}
