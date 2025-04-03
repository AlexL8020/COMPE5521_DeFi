// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MockStableCoin is ERC20, Ownable {
    constructor() ERC20("Mock Stable Coin", "MSC") Ownable(msg.sender) {}

    // Function to mint tokens to new users
    function mintForNewUser(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}
