// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract GoodContract {

    mapping(address => uint) public balances;

   // Actualice el mapping de `balances` para incluir el nuevo ETH depositado por msg.sender
    function addBalance() public payable {
        balances[msg.sender] += msg.value;
    }

   // Enviar ETH por valor de `balances[msg.sender]` de vuelta a msg.sender
    function withdraw() public {
        require(balances[msg.sender] > 0);
        (bool sent, ) = msg.sender.call{value: balances[msg.sender]}("");
        require(sent, "Failed to send ether");
       // Este código se vuelve inalcanzable porque el balance del contrato se agota
         // antes de que el balance del usuario se haya establecido en 0
        balances[msg.sender] = 0;
    }
}