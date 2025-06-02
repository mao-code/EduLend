// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import "openzeppelin-contracts/contracts/utils/math/Math.sol";
import "./EduToken.sol";
import "./MockStablecoin.sol";
import "./PriceOracle.sol";

/// @title LendingPlatform ― 最小流程借貸合約
/// @notice 抵押 EDU，借出 mUSDT；月利率固定 7%，清算門檻 90 %
contract LendingPlatform {
    using Math for uint256;

    uint256 public constant WAD = 1e18;
    uint256 public constant MONTHLY_RATE_WAD = 7e16; // 0.07 × 1e18
    uint256 public constant RATE_PER_SEC_WAD = MONTHLY_RATE_WAD / 2_592_000; // 30 天 ≒ 2 592 000 秒
    uint256 public constant LTV_PRECISION = 1e4; // 100% = 1e4
    uint256 public constant MAX_LTV = 9_000; // 90%

    IERC20 public immutable edu; // 抵押物 (Interface, 任何 ERC20 都可, 到時候傳入，使用EduToken即可)
    MockStablecoin public immutable stable; // 貸出資產（平台為 owner，可 mint）
    PriceOracle public immutable oracle; // 價格來源（mUSDT / EDU）

    // Hashmaps
    mapping(address => uint256) public collateral;   // EDU 數量
    mapping(address => uint256) public principal;    // 未計息本金
    mapping(address => uint256) public lastAccrued;  // 上次結息時間戳

    // console logging
    event Deposit(address indexed user, uint256 amount);
    event Borrow (address indexed user, uint256 amount);
    event Repay  (address indexed user, uint256 amount);
    event Redeem (address indexed user, uint256 amount);
    event Liquidate(address indexed user, address indexed liquidator);

    constructor(
        address _edu,
        address _stable,
        address _oracle
    ) {
        edu = IERC20(_edu);
        stable = MockStablecoin(_stable);
        oracle = PriceOracle(_oracle);
    }

    /// @dev 回傳 (本金+利息) ― 並不改變 state
    function _debtWithInterest(address user) internal view returns (uint256) {
        if (principal[user] == 0) return 0;
        uint256 dt = block.timestamp - lastAccrued[user];
        uint256 interest = principal[user] * RATE_PER_SEC_WAD * dt / WAD;
        return principal[user] + interest;
    }

    /// @dev 實際把利息累加進本金
    function _accrue(address user) internal {
        uint256 debt = _debtWithInterest(user);
        if (debt > principal[user]) {
            principal[user] = debt;
            lastAccrued[user] = block.timestamp;
        }
    }

    /// @dev 抵押品價值（mUSDT）
    function _collateralValue(address user) internal view returns (uint256) {
        uint256 price = oracle.getPrice(); // mUSDT / EDU (18 decimals)
        return collateral[user] * price / WAD;
    }

    /// @notice 抵押 EDU
    function deposit(uint256 amount) external {
        require(amount > 0, "zero");
        edu.transferFrom(msg.sender, address(this), amount);
        collateral[msg.sender] += amount;
        emit Deposit(msg.sender, amount);
    }

    /// @notice 借出 mUSDT (任意數量)
    function borrow(uint256 amount) external {
        _accrue(msg.sender);
        uint256 debtAfter = _debtWithInterest(msg.sender) + amount;
        uint256 maxBorrow = _collateralValue(msg.sender) * MAX_LTV / LTV_PRECISION; // 有累計之前的EduToken價值
        require(debtAfter <= maxBorrow, "exceeds LTV");
        principal[msg.sender] = debtAfter;
        lastAccrued[msg.sender] = block.timestamp;

        stable.mint(msg.sender, amount); // 平台為 owner，可 mint
        emit Borrow(msg.sender, amount);
    }

    /// @notice 還款（任意金額）
    function repay(uint256 amount) external {
        // require(amount > 0, "zero"); // 允許 0 金額還款，僅觸發結息
        _accrue(msg.sender);

        uint256 debt = principal[msg.sender];
        require(debt > 0, "no debt");
        uint256 pay = amount > debt ? debt : amount;

        stable.transferFrom(msg.sender, address(this), pay);
        principal[msg.sender] = debt - pay;
        lastAccrued[msg.sender] = block.timestamp;
        emit Repay(msg.sender, pay);
    }

    /// @notice 贖回抵押品
    function redeem(uint256 amount) external {
        require(amount > 0, "zero");
        _accrue(msg.sender);
        require(collateral[msg.sender] >= amount, "insufficient col");

        // 計算贖回後 LTV
        uint256 newCollateral = collateral[msg.sender] - amount;
        if (principal[msg.sender] > 0 && newCollateral > 0) {
            uint256 maxBorrow = (newCollateral * oracle.getPrice() / WAD) * MAX_LTV / LTV_PRECISION;
            require(principal[msg.sender] <= maxBorrow, "would exceed LTV");
        } else {
            require(principal[msg.sender] == 0, "outstanding debt");
        }

        collateral[msg.sender] = newCollateral;
        edu.transfer(msg.sender, amount);
        emit Redeem(msg.sender, amount);
    }

    /// @notice 任何人都能觸發清算
    function liquidate(address user) external {
        _accrue(user);

        uint256 debt = principal[user];
        uint256 colValue = _collateralValue(user);

        require(debt >= colValue * MAX_LTV / LTV_PRECISION, "not liquidatable");
        require(debt > 0, "no debt");

        // 清算人需一次性償還借款，拿走全部抵押
        stable.transferFrom(msg.sender, address(this), debt);
        edu.transfer(msg.sender, collateral[user]);

        // 歸 0
        collateral[user] = 0;
        principal[user] = 0;
        lastAccrued[user] = block.timestamp;

        emit Liquidate(user, msg.sender);
    }
}
