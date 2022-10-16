const {
    FlashbotsBundleProvider,
  } = require("@flashbots/ethers-provider-bundle");
  const { BigNumber } = require("ethers");
  const { ethers } = require("hardhat");
  require("dotenv").config({ path: ".env" });
  
  async function main() {
    // Implementar FakeNFT Contract
    const fakeNFT = await ethers.getContractFactory("FakeNFT");
    const FakeNFT = await fakeNFT.deploy();
    await FakeNFT.deployed();
  
    console.log("Address of Fake NFT Contract:", FakeNFT.address);
  
    // Crear un proveedor de WebSocket de Alchemy
    const provider = new ethers.providers.WebSocketProvider(
      process.env.QUICKNODE_WS_URL,
      "goerli"
    );
  
   // Envuelve tu clave privada en la clase Wallet de ethers
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  
    // Crear un proveedor de Flashbots que reenviará la solicitud al repetidor
     // Que luego lo enviará al minero flashbot
    const flashbotsProvider = await FlashbotsBundleProvider.create(
      provider,
      signer,
   
   // URL para el repetidor de flashbots
      "https://relay-goerli.flashbots.net",
      "goerli"
    );
  
    provider.on("block", async (blockNumber) => {
      console.log("Block Number: ", blockNumber);
    // Enviar un paquete de transacciones al repetidor flashbot
      const bundleResponse = await flashbotsProvider.sendBundle(
        [
          {
            transaction: {
            // ChainId para la red Goerli
              chainId: 5,
              // EIP-1559
              type: 2,
              // Valor de 1 FakeNFT
              value: ethers.utils.parseEther("0.01"),
              // Address de FakeNFT
              to: FakeNFT.address,
              // En el campo de datos, pasamos el selector de funciones de la funcion mint
              data: FakeNFT.interface.getSighash("mint()"),
           // Max Gas Fes que estás dispuesto a pagar
              maxFeePerGas: BigNumber.from(10).pow(9).mul(3),
// Tarifas máximas de gas prioritario que está dispuesto a pagar
              maxPriorityFeePerGas: BigNumber.from(10).pow(9).mul(2),
            },
            signer: signer,
          },
        ],
        blockNumber + 1
      );
  
 // Si hay un error presente, regístrelo
      if ("error" in bundleResponse) {
        console.log(bundleResponse.error.message);
      }
    });
  }
  
  main();