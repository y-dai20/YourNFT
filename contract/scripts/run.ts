import { ethers } from "hardhat";

async function run() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contract with the account: ", deployer.address);

  const YourNFT = await ethers.getContractFactory("YourNFT");
  const yourNFT = await YourNFT.deploy();
  await yourNFT.deployed();

  console.log("Contract deployed at: ", yourNFT.address);
  console.log("Contract's owner is:", await yourNFT.owner());
}

run()
  .then(() => process.exit())
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
