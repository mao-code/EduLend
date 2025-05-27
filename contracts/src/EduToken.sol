// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-contracts/contracts/access/Ownable.sol";

/// @title EduToken - 支援價格跌破清算線的非線性價格模型 (x * y = k)
contract EduToken is ERC20, Ownable {
    uint256 public reserveETH; // 儲備 ETH
    uint256 public reserveEDU; // 儲備 EDU（僅用於計價，不代表實際 ERC20 數量）
    uint256 public ethToMusdt; // ETH 對 mUSDT 匯率（單位：mUSDT / ETH，18 decimals）

    event Bought(address indexed buyer, uint256 amount, uint256 cost);
    event Sold(address indexed seller, uint256 amount, uint256 revenue);
    event ExchangeRateUpdated(uint256 newRate);

    constructor() ERC20("EduToken", "EDU") Ownable(msg.sender) {
        reserveETH = 1 ether;       // 初始化儲備 ETH（流動性池）
        reserveEDU = 1000 ether;    // 初始化儲備 EDU（EDU 價格初始為 1 ETH / 1000 EDU = 0.001 ETH）
        _mint(msg.sender, 1000 ether); // 初始發行給抵押者（模擬抵押行為）
        ethToMusdt = 2000e18;       // 預設匯率：1 ETH = 2000 mUSDT
    }

    /// @notice 更新 ETH 對 mUSDT 匯率（只限 owner）
    function setExchangeRate(uint256 _rate) external onlyOwner {
        require(_rate > 0, "Rate must be positive");
        ethToMusdt = _rate;
        emit ExchangeRateUpdated(_rate);
    }

    /// @notice 回傳目前價格（單位：ETH / EDU）
    function currentPrice() public view returns (uint256) {
        require(reserveEDU > 0, "No supply");
        return (reserveETH * 1e18) / reserveEDU;
    }

    /// @notice 回傳目前價格（單位：mUSDT / EDU）
    function currentPriceInMusdt() public view returns (uint256) {
        return (currentPrice() * ethToMusdt) / 1e18;
    }

    /// @notice 預估買入指定 EDU 數量所需 ETH
    function getEthRequiredToBuy(uint256 eduAmountOut) public view returns (uint256) {
        require(eduAmountOut > 0 && eduAmountOut < reserveEDU, "Invalid EDU amount");
        return (reserveETH * eduAmountOut) / (reserveEDU - eduAmountOut);
    }

    /// @notice 預估買入指定 EDU 數量所需 mUSDT（供前端顯示）
    function getMusdtRequiredToBuy(uint256 eduAmountOut) external view returns (uint256) {
        uint256 ethRequired = getEthRequiredToBuy(eduAmountOut);
        return (ethRequired * ethToMusdt) / 1e18;
    }

    /// @notice 預估賣出指定 EDU 數量可換得的 ETH
    function getEthReturnFromSell(uint256 eduAmountIn) public view returns (uint256) {
        require(eduAmountIn > 0, "Invalid EDU amount");
        return (reserveETH * eduAmountIn) / (reserveEDU + eduAmountIn);
    }

    /// @notice 預估賣出指定 EDU 數量可換得的 mUSDT（供前端顯示）
    function getMusdtReturnFromSell(uint256 eduAmountIn) external view returns (uint256) {
        uint256 ethReturn = getEthReturnFromSell(eduAmountIn);
        return (ethReturn * ethToMusdt) / 1e18;
    }

    function buy(uint256 eduAmountOut) external payable {
        require(eduAmountOut > 0, "Cannot buy 0");

        uint256 ethRequired = getEthRequiredToBuy(eduAmountOut);
        require(msg.value >= ethRequired, "Insufficient ETH sent");

        reserveETH += ethRequired;
        reserveEDU -= eduAmountOut;
        _mint(msg.sender, eduAmountOut);

        if (msg.value > ethRequired) {
            payable(msg.sender).transfer(msg.value - ethRequired);
        }

        emit Bought(msg.sender, eduAmountOut, ethRequired);
    }

    function sell(uint256 eduAmountIn) external {
        require(balanceOf(msg.sender) >= eduAmountIn, "Insufficient EDU");

        uint256 ethOut = getEthReturnFromSell(eduAmountIn);
        require(ethOut <= reserveETH, "Not enough ETH in pool");

        _burn(msg.sender, eduAmountIn);
        reserveEDU += eduAmountIn;
        reserveETH -= ethOut;
        payable(msg.sender).transfer(ethOut);

        emit Sold(msg.sender, eduAmountIn, ethOut);
    }

    receive() external payable {}
}
