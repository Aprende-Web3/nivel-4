const { expect } = require("chai");
const { BigNumber } = require("ethers");
const { ethers, waffle } = require("hardhat");

describe("Attack", function () {
  it("Attack.sol will be able to change the owner of Good.sol", async function () {
    // Obtener una dirección
    const [_, addr1] = await ethers.getSigners();

    // Implementar el good contract
    const goodContract = await ethers.getContractFactory("Good");
    const _goodContract = await goodContract.connect(addr1).deploy();
    await _goodContract.deployed();
    console.log("Good Contract's Address:", _goodContract.address);

    // Implementar el Attack contract
    const attackContract = await ethers.getContractFactory("Attack");
    const _attackContract = await attackContract.deploy(_goodContract.address);
    await _attackContract.deployed();
    console.log("Attack Contract's Address", _attackContract.address);

    let tx = await _attackContract.connect(addr1).attack();
    await tx.wait();

  // Ahora vamos a comprobar si el propietario actual de Good.sol es en realidad Attack.sol
    expect(await _goodContract.owner()).to.equal(_attackContract.address);
    console.log(await _goodContract.owner());
  });
});