// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-contracts/contracts/access/Ownable.sol";

/// @notice 
contract EduToken is ERC20, Ownable {
    uint256 public immutable P0; //初始價格
    uint256 public immutable k; //斜率

    event Bought(address indexed user, uint256 amount, uint256 cost);
    event Sold(address indexed user, uint256 amount, uint256 revenue);

    constructor(
        string memory name_,
        string memory symbol_,
        uint256 initialSupply,
        uint256 _P0,
        uint256 _k
    ) ERC20(name_, symbol_) {
        P0 = _P0;
        k  = _k;
        _mint(msg.sender, initialSupply);
    }

    function currentPrice() public view returns (uint256) {
        return P0 + k * totalSupply();
    }

    function buy(uint256 amount) external payable {
        uint256 S0 = totalSupply();
        uint256 S1 = S0 + amount;
        uint256 costP0 = P0 * amount;
        uint256 costK  = k * ((S1*S1 - S0*S0) / 2);
        uint256 cost   = costP0 + costK;
        require(msg.value >= cost, "Insufficient ETH");

        _mint(msg.sender, amount);
        if (msg.value > cost) payable(msg.sender).transfer(msg.value - cost);
        emit Bought(msg.sender, amount, cost);
    }

    function sell(uint256 amount) external {
        uint256 S0 = totalSupply();
        require(S0 >= amount, "Not enough supply");
        uint256 S1 = S0 - amount;
        uint256 revP0 = P0 * amount;
        uint256 revK  = k * ((S0*S0 - S1*S1) / 2);
        uint256 revenue = revP0 + revK;

        _burn(msg.sender, amount);
        payable(msg.sender).transfer(revenue);
        emit Sold(msg.sender, amount, revenue);
    }

    function mint(address to, uint256 amt) external onlyOwner {
        _mint(to, amt);
    }

    receive() external payable {}
}
