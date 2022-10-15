//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";


contract AW3NFT is Initializable, ERC721Upgradeable, UUPSUpgradeable, OwnableUpgradeable   {
// Observe cómo creamos una función de inicialización y luego agregamos el
     // modificador del inicializador que asegura que 
     // la función de inicialización solo se llama una vez
    function initialize() public initializer  {
       // Tenga en cuenta que en lugar de usar el constructor ERC721(), tenemos que inicializarlo manualmente
         // Lo mismo ocurre con el contrato Ownable donde tenemos que inicializarlo manualmente
        __ERC721_init("AW3NFT", "AW3NFT");
        __Ownable_init();
        _mint(msg.sender, 1);
    }
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {

    }
}