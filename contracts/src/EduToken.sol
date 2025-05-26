// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-contracts/contracts/access/Ownable.sol";

/// @title EduToken - 支援價格跌破清算線的非線性價格模型 (x * y = k)
contract EduToken is ERC20, Ownable {
    uint256 public reserveETH; // 儲備 ETH
    uint256 public reserveEDU; // 儲備 EDU（僅用於計價，不代表實際 ERC20 數量）

    event Bought(address indexed buyer, uint256 amount, uint256 cost);
    event Sold(address indexed seller, uint256 amount, uint256 revenue);

    constructor() ERC20("EduToken", "EDU") Ownable(msg.sender) {
        reserveETH = 1 ether;       // 初始化儲備 ETH（流動性池）
        reserveEDU = 1000 ether;    // 初始化儲備 EDU（價格初始為 1 ETH / 1000 EDU = 0.001 ETH）
        _mint(msg.sender, 1000 ether); // 初始發行給抵押者（模擬抵押行為）
    }

    /// @notice 取得當前 EDU 價格（ETH / EDU），即 reserveETH / reserveEDU
    function currentPrice() public view returns (uint256) {
        require(reserveEDU > 0, "No supply");
        return (reserveETH * 1e18) / reserveEDU;
    }

    /// @notice 買入 EDU，支付 ETH，根據 Uniswap v2 定價公式
    function buy(uint256 eduAmountOut) external payable {
        require(eduAmountOut > 0, "Cannot buy 0");

        // Uniswap v2 常見公式：Δx = (x * Δy) / (y - Δy)
        uint256 ethRequired = (reserveETH * eduAmountOut) / (reserveEDU - eduAmountOut);
        require(msg.value >= ethRequired, "Insufficient ETH sent");

        reserveETH += ethRequired;
        reserveEDU -= eduAmountOut;
        _mint(msg.sender, eduAmountOut);

        // 退款
        if (msg.value > ethRequired) {
            payable(msg.sender).transfer(msg.value - ethRequired);
        }

        emit Bought(msg.sender, eduAmountOut, ethRequired);
    }

    /// @notice 賣出 EDU，換回 ETH，根據 Uniswap v2 定價公式
    function sell(uint256 eduAmountIn) external {
        require(balanceOf(msg.sender) >= eduAmountIn, "Insufficient EDU");

        uint256 ethOut = (reserveETH * eduAmountIn) / (reserveEDU + eduAmountIn);
        require(ethOut <= reserveETH, "Not enough ETH in pool");

        _burn(msg.sender, eduAmountIn);
        reserveEDU += eduAmountIn;
        reserveETH -= ethOut;
        payable(msg.sender).transfer(ethOut);

        emit Sold(msg.sender, eduAmountIn, ethOut);
    }

    receive() external payable {}
}
