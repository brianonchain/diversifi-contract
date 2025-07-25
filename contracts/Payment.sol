// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import {IERC20Complete} from "./interfaces/IERC20Complete.sol";

contract Payment {
    // interfaces
    IERC20Complete public immutable usdcToken;

    // state vars
    address public _owner;

    // structs
    struct PaymentStruct {
        address to;
        uint256 amount;
        bytes32[] items;
    }

    // events
    event PayEvent(address indexed from, address indexed to, uint256 amount, bytes32[] items);

    // constructor
    constructor(address _usdcTokenAddress) {
        usdcToken = IERC20Complete(_usdcTokenAddress);
        _owner = msg.sender;
    }

    // functions
    function pay(PaymentStruct calldata payment) public {
        require(payment.amount > 0, "amount should be > 0");
        bool success = usdcToken.transferFrom(msg.sender, payment.to, payment.amount);
        require(success, "USDC transfer failed");
        emit PayEvent(msg.sender, payment.to, payment.amount, payment.items);
    }
}

// an item in items array has the following fields:
//     uint8 version; // 1 byte, version
//     uint8 currencyId; // 1 byte, currency id
//     uint8 cashback; // 1 byte, 5=>0.5%, 100=>10%, max=25.5%
//     uint16 quantity; // 2 bytes, max quantity is 65,534
//     uint32 productId; // 4 bytes, max 4,294,967,295 items
//     uint64 currencyPrice; // 8 bytes, per item price in local currency
//     uint64 usdcReceived; // 8 bytes, amount of usdc received for this item
// 25 bytes used, 7 bytes left
