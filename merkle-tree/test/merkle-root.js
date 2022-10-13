const { expect } = require("chai");
const { ethers } = require("hardhat");
const keccak256 = require("keccak256");
const { MerkleTree } = require("merkletreejs");


function encodeLeaf(address, spots) {
 // Igual que `abi.encodePacked` en Solidity
  return ethers.utils.defaultAbiCoder.encode(
    ["address", "uint64"],
    [address, spots]
  );
}


describe("Check if merkle root is working", function () {
  it("Should be able to verify if a given address is in whitelist or not", async function () {
  
   // Obtener un montón de direcciones de prueba
    const [owner, addr1, addr2, addr3, addr4, addr5] =
      await ethers.getSigners();
    
   // Cree un array de elementos que desee codificar en el Merkle Tree
    const list = [
      encodeLeaf(owner.address, 2),
      encodeLeaf(addr1.address, 2),
      encodeLeaf(addr2.address, 2),
      encodeLeaf(addr3.address, 2),
      encodeLeaf(addr4.address, 2),
      encodeLeaf(addr5.address, 2),
    ];


 // Crea el Merkle Tree usando el algoritmo hash `keccak256`
     // Asegúrese de ordenar el árbol para que se pueda producir de manera determinista independientemente
     // del orden de la lista de entrada
    const merkleTree = new MerkleTree(list, keccak256, {
      hashLeaves: true,
      sortPairs: true,
    });
    // Calcular la raíz de Merkle
    const root = merkleTree.getHexRoot();


    // Implementar el contrato de Whitelist
    const whitelist = await ethers.getContractFactory("Whitelist");
    const Whitelist = await whitelist.deploy(root);
    await Whitelist.deployed();


   // Calcular la prueba de Merkle de la dirección del propietario (elemento 0 en la lista)
     // fuera de la cadena. El nodo hoja es el hash de ese valor.
    const leaf = keccak256(list[0]);
    const proof = merkleTree.getHexProof(leaf);


   // Proporcione la prueba de Merkle al contrato y asegúrese de que pueda verificarse
     // que este nodo hoja era de hecho parte del árbol de Merkle
    let verified = await Whitelist.checkInWhitelist(proof, 2);
    expect(verified).to.equal(true);
  // Proporcione una prueba de Merkle no válida para el contrato y asegúrese de que
     // puede verificar que este nodo hoja NO era parte del Merkle Tree
    verified = await Whitelist.checkInWhitelist([], 2);
    expect(verified).to.equal(false);
  });
});