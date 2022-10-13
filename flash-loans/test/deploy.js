const { expect, assert } = require("chai");
const { BigNumber } = require("ethers");
const { ethers, waffle, artifacts } = require("hardhat");
const hre = require("hardhat");

const { DAI, DAI_WHALE, POOL_ADDRESS_PROVIDER } = require("../config");

describe("Deploy a Flash Loan", function () {
  it("Should take a flash loan and be able to return it", async function () {
    const flashLoanExample = await ethers.getContractFactory(
      "FlashLoanExample"
    );

    const _flashLoanExample = await flashLoanExample.deploy(
      // Dirección del PoolAddressProvider: puede encontrarlo aquí: https://docs.aave.com/developers/deployed-contracts/v3-mainnet/polygon
      POOL_ADDRESS_PROVIDER
    );
    await _flashLoanExample.deployed();
    console.log(_flashLoanExample);

    const token = await ethers.getContractAt("IERC20", DAI);
    const BALANCE_AMOUNT_DAI = ethers.utils.parseEther("2000");
    
   // Suplantar la cuenta DAI_WHALE para poder enviar transacciones desde esa cuenta
    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [DAI_WHALE],
    });
    const signer = await ethers.provider.getSigner(DAI_WHALE);
    await token
      .connect(signer)
      .transfer(_flashLoanExample.address, BALANCE_AMOUNT_DAI);  // Envía a nuestro contrato 2000 DAI desde el DAI_WHALE

    const tx = await _flashLoanExample.createFlashLoan(DAI, 1000); // Pida prestado 1000 DAI en un Préstamo Flash sin garantía inicial
    await tx.wait();
    const remainingBalance = await token.balanceOf(_flashLoanExample.address); // Verifique el saldo de DAI en el contrato de préstamo flash después
    expect(remainingBalance.lt(BALANCE_AMOUNT_DAI)).to.be.true; // Debemos tener menos de 2000 DAI ahora, ya que la prima se pagó del saldo de nuestro contrato
  });
});