//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./AW3NFT.sol";

contract AW3NFT2 is AW3NFT {

    function test() pure public returns(string memory) {
        return "upgraded";
    }
}