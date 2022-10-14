// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Login {

  // Variables privadas
     // Cada variable bytes32 ocuparía una ranura
     // porque la variable bytes32 tiene 256 bits (32*8)
     // el cuál es el tamaño de una ranura

    // Slot 0
    bytes32 private username;
    // Slot 1
    bytes32 private password;

    constructor(bytes32  _username, bytes32  _password) {
        username = _username;
        password = _password;
    }
}