const { expect } = require("chai");
const { BigNumber } = require("ethers");
const { ethers, waffle } = require("hardhat");

describe("Attack", function () {
  it("After being declared the winner, Attack.sol should not allow anyone else to become the winner", async function () {
    // Implementa el good contract
    const goodContract = await ethers.getContractFactory("Good");
    const _goodContract = await goodContract.deploy();
    await _goodContract.deployed();
    console.log("Good Contract's Address:", _goodContract.address);

    // Implementa el Attack contract
    const attackContract = await ethers.getContractFactory("Attack");
    const _attackContract = await attackContract.deploy(_goodContract.address);
    await _attackContract.deployed();
    console.log("Attack Contract's Address", _attackContract.address);

    // Ahora ataquemos al good contract
     // Obtener dos direcciones
   
    const [_, addr1, addr2] = await ethers.getSigners();

  // Inicialmente dejar que addr1 se convierta en el ganador actual de la subasta
    let tx = await _goodContract.connect(addr1).setCurrentAuctionPrice({
      value: ethers.utils.parseEther("1"),
    });
    await tx.wait();
// Comienza el ataque y convierte a Attack.sol en el actual ganador de la subasta
    tx = await _attackContract.attack({
      value: ethers.utils.parseEther("3.0"),
    });
    await tx.wait();

 // Ahora intentemos hacer que addr2 sea el ganador actual de la subasta
    tx = await _goodContract.connect(addr2).setCurrentAuctionPrice({
      value: ethers.utils.parseEther("4"),
    });
    await tx.wait();

   // Ahora veamos si el ganador actual sigue siendo un contrato de ataque
    expect(await _goodContract.currentWinner()).to.equal(
      _attackContract.address
    );
  });
});