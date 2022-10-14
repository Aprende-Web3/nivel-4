const { expect } = require("chai");
const { BigNumber } = require("ethers");
const { parseEther } = require("ethers/lib/utils");
const { ethers } = require("hardhat");

describe("Attack", function () {
  it("Should empty the balance of the good contract", async function () {
   // Implementar Good Contract
    const goodContractFactory = await ethers.getContractFactory("GoodContract");
    const goodContract = await goodContractFactory.deploy();
    await goodContract.deployed();

  //Implementar Bad Contract
    const badContractFactory = await ethers.getContractFactory("BadContract");
    const badContract = await badContractFactory.deploy(goodContract.address);
    await badContract.deployed();

// Obtenga dos direcciones, trate una como usuario inocente y otra como atacante
    const [_, innocentAddress, attackerAddress] = await ethers.getSigners();

  // El usuario inocente deposita 10 ETH en GoodContract
    let tx = await goodContract.connect(innocentAddress).addBalance({
      value: parseEther("10"),
    });
    await tx.wait();

  // Comprobar que en este punto el saldo de GoodContract es de 10 ETH
    let balanceETH = await ethers.provider.getBalance(goodContract.address);
    expect(balanceETH).to.equal(parseEther("10"));

   // El atacante llama a la función `attack` en BadContract
     // y envía 1 ETH
    tx = await badContract.connect(attackerAddress).attack({
      value: parseEther("1"),
    });
    await tx.wait();

    // El saldo de la dirección de GoodContract ahora es cero
    balanceETH = await ethers.provider.getBalance(goodContract.address);
    expect(balanceETH).to.equal(BigNumber.from("0"));

// El saldo de BadContract ahora es de 11 ETH (10 ETH robados + 1 ETH del atacante)
    balanceETH = await ethers.provider.getBalance(badContract.address);
    expect(balanceETH).to.equal(parseEther("11"));
  });
});