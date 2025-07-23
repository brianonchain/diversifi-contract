// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

// imports
import {IERC20Complete} from "./interfaces/IERC20Complete.sol";

contract Deposit {
    // interfaces
    IERC20Complete public usdcToken;

    // state variabels
    address public _owner;
    mapping(address => uint256) public balances;

    // events
    event DepositEvent(address indexed user, uint256 amount);
    event WithdrawalEvent(address indexed user, uint256 amount);

    // constructor
    constructor(address _usdcTokenAddress) {
        usdcToken = IERC20Complete(_usdcTokenAddress);
        _owner = msg.sender;
    }

    // functions

    function getOwner() public view returns (address) {
        return _owner;
    }

    function getSender() public view returns (address) {
        return msg.sender;
    }

    function tester() public view returns (uint256) {
        uint256 allowance = usdcToken.allowance(msg.sender, address(this));
        return allowance;
    }

    function deposit(uint256 amount) public {
        require(amount > 0, "amount should be > 0");

        // Transfer USDC from the user to the contract
        bool success = usdcToken.transferFrom(
            msg.sender,
            address(this),
            amount
        );
        require(success, "USDC transfer failed");

        // Update the user's balance
        balances[msg.sender] += amount;

        emit DepositEvent(msg.sender, amount);
    }

    function withdraw(uint256 amount) public {
        require(amount > 0, "Withdrawal amount must be greater than zero");
        require(balances[msg.sender] >= amount, "Insufficient balance");

        // Update the user's balance
        balances[msg.sender] -= amount;

        // Transfer USDC from the contract to the user
        bool success = usdcToken.transfer(msg.sender, amount);
        require(success, "USDC transfer failed");

        emit WithdrawalEvent(msg.sender, amount);
    }

    function getBalance(address user) public view returns (uint256) {
        return balances[user];
    }
}
