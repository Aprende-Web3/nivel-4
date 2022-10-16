const { expect } = require("chai");
const { BigNumber } = require("ethers");
const { arrayify, parseEther } = require("ethers/lib/utils");
const { ethers } = require("hardhat");

describe("MetaTokenTransfer", function () {
  it("Should let user transfer tokens through a relayer", async function () {
 // Implementar los contratos
    const RandomTokenFactory = await ethers.getContractFactory("RandomToken");
    const randomTokenContract = await RandomTokenFactory.deploy();
    await randomTokenContract.deployed();

    const MetaTokenSenderFactory = await ethers.getContractFactory(
      "TokenSender"
    );
    const tokenSenderContract = await MetaTokenSenderFactory.deploy();
    await tokenSenderContract.deployed();

   // Obtenga tres direcciones, trate una como la dirección del usuario
     // uno como la dirección del repetidor y otro como la dirección del destinatario
    const [_, userAddress, relayerAddress, recipientAddress] =
      await ethers.getSigners();

 // Mint 10,000 tokens a la dirección del usuario (para prueba)
    const tenThousandTokensWithDecimals = parseEther("10000");
    const userTokenContractInstance = randomTokenContract.connect(userAddress);
    const mintTxn = await userTokenContractInstance.freeMint(
      tenThousandTokensWithDecimals
    );
    await mintTxn.wait();

   // Hacer que el usuario infinito apruebe el contrato del remitente del token para transferir 'RandomToken'
    const approveTxn = await userTokenContractInstance.approve(
      tokenSenderContract.address,
      BigNumber.from(
    // Este es el valor máximo de uint256 (2^256 - 1) en hexadecimal
         // Dato curioso: Hay 64 f's aquí.
         // En hexadecimal, cada dígito puede representar 4 bits
         // f es el dígito más grande en hexadecimal (1111 en binario)
         // 4 + 4 = 8, es decir, dos dígitos hexadecimales = 1 byte
         // 64 dígitos = 32 bytes
         // 32 bytes = 256 bits = uint256
        "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
      )
    );
    await approveTxn.wait();

   // Haga que el usuario firme el mensaje para transferir 10 tokens al destinatario
    const transferAmountOfTokens = parseEther("10");
    const messageHash = await tokenSenderContract.getHash(
      userAddress.address,
      transferAmountOfTokens,
      recipientAddress.address,
      randomTokenContract.address
    );
    const signature = await userAddress.signMessage(arrayify(messageHash));

 // Hacer que el repetidor ejecute la transacción en nombre del usuario
    const relayerSenderContractInstance =
      tokenSenderContract.connect(relayerAddress);
    const metaTxn = await relayerSenderContractInstance.transfer(
      userAddress.address,
      transferAmountOfTokens,
      recipientAddress.address,
      randomTokenContract.address,
      signature
    );
    await metaTxn.wait();

    // Verifique que el saldo del usuario haya disminuido y el destinatario haya recibido 10 tokens
    const userBalance = await randomTokenContract.balanceOf(
      userAddress.address
    );
    const recipientBalance = await randomTokenContract.balanceOf(
      recipientAddress.address
    );

    expect(userBalance.lt(tenThousandTokensWithDecimals)).to.be.true;
    expect(recipientBalance.gt(BigNumber.from(0))).to.be.true;
  });
});