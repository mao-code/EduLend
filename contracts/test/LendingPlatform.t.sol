// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "forge-std/Test.sol";
import "../src/LendingPlatform.sol";
import "../src/EduToken.sol";
import "../src/MockStablecoin.sol";
import "../src/PriceOracle.sol";

contract LendingPlatformTest is Test {
    EduToken edu;
    MockStablecoin musdt;
    PriceOracle oracle;
    LendingPlatform platform;

    address alice = address(0xA1);
    address bob   = address(0xB0);

    function setUp() public {
        edu    = new EduToken();
        musdt  = new MockStablecoin();
        oracle = new PriceOracle();

        musdt.mint(bob, 2_000 ether); // 讓Bob也是owner

        platform = new LendingPlatform(address(edu), address(musdt), address(oracle));
        // 平台成為 owner
        musdt.transferOwnership(address(platform));

        // 撥給測試帳戶 EDU
        edu.transfer(alice, 1_000 ether);
        edu.transfer(bob,   1_000 ether);


        vm.label(alice, "Alice");
        vm.label(bob,   "Bob");
    }

    function _deposit(address user, uint256 amount) internal {
        vm.startPrank(user);
        edu.approve(address(platform), amount);
        platform.deposit(amount);
        vm.stopPrank();
    }

    /* happy-path  deposit/borrow */
    function testBorrowWithinLimit() public {
        _deposit(alice, 500 ether); // about 1 000 mUSDT * 90%

        vm.startPrank(alice);
        platform.borrow(400 ether);
        assertEq(musdt.balanceOf(alice), 400 ether);
        vm.stopPrank();
    }

    function testCannotBorrowOverLTV() public {
        _deposit(alice, 500 ether);
        vm.startPrank(alice);
        vm.expectRevert();
        platform.borrow(800 ether);         // > 90 % LTV at current price
        vm.stopPrank();
    }

    /* repay & redeem */
    function testRepayAndRedeem() public {
        _deposit(alice, 500 ether);

        vm.startPrank(alice);
        platform.borrow(300 ether);
        musdt.approve(address(platform), 300 ether);
        platform.repay(300 ether);                           // 全額還款
        platform.redeem(500 ether);                          // 贖回全部
        vm.stopPrank();

        assertEq(edu.balanceOf(alice), 1_000 ether);
        assertEq(platform.collateral(alice), 0);
    }

    /* interest accrual (30 days) */
    function testInterestAccrual() public {
        _deposit(alice, 500 ether);

        vm.startPrank(alice);
        platform.borrow(100 ether);                          // t0
        vm.warp(block.timestamp + 30 days);                  // +30 days
        // uint256 debt = platform.principal(alice);            // 尚未結息
        platform.repay(0);                                   // dummy 觸發 accrue
        uint256 accrued = platform.principal(alice);
        assertGt(accrued, 100 ether);                        // 應 >100
        vm.stopPrank();
    }

    /* liquidation */
    function testLiquidationFlow() public {
        _deposit(alice, 1_000 ether);                        // 估值 about 2 000 mUSDT
        vm.startPrank(alice);
        platform.borrow(1_400 ether);                        // LTV about 85%
        vm.stopPrank();

        // 價格衰退到 0.888… → collateral 值 ≒ 888 mUSDT
        oracle.advance(); oracle.advance(); oracle.advance(); oracle.advance();

        // Bob 觀察到可清算
        vm.startPrank(bob);
        musdt.approve(address(platform), type(uint256).max);
        platform.liquidate(alice); // 清算成功
        vm.stopPrank();

        assertEq(platform.collateral(alice), 0);
        assertEq(edu.balanceOf(bob), 2_000 ether);           // 抵押給 Bob
    }
}
