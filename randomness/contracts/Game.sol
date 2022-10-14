// SPDX-License-Identifier: MIT
  pragma solidity ^0.8.4;

  contract Game {
  constructor() payable {}

   /**
           Elige aleatoriamente un número de `0 a 2²⁵⁶–1`.
       */
      function pickACard() private view returns(uint) {
       // `abi.encodePacked` toma los dos parámetros - `blockhash` y `block.timestamp`
           // y devuelve un array de bytes que luego pasa a keccak256 que devuelve `bytes32`
           // que luego se convierte en `uint`.
           // keccak256 es una función hash que toma un array de bytes y la convierte en bytes32
          uint pickedCard = uint(keccak256(abi.encodePacked(blockhash(block.number), block.timestamp)));
          return pickedCard;
      }

   /**
           Comienza el juego eligiendo primero un número aleatorio llamando a `pickACard`
           Luego verifica si el número aleatorio seleccionado es igual a `_guess` pasado por el jugador
           Si el jugador adivinó el número correcto, envía al jugador `0.1 ether`
       */
      function guess(uint _guess) public {
          uint _pickedCard = pickACard();
          if(_guess == _pickedCard){
              (bool sent,) = msg.sender.call{value: 0.1 ether}("");
              require(sent, "Failed to send ether");
          }
      }

    /**
           Devuelve el saldo de ether en el contrato
       */
      function getBalance() view public returns(uint) {
          return address(this).balance;
      }

  }