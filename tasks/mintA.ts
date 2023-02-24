import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";

import ERC721ACollectionArtifact from "../artifacts/contracts/ERC721A/ERC721ACollection.sol/ERC721ACollection.json";

task("mintA", "Mint on a ERC721A collection")
  .addParam("collection", "ERC721ACollection contract address")
  .setAction(async (_taskArgs: TaskArguments, { ethers }) => {
    const signers: SignerWithAddress[] = await ethers.getSigners();
    const admin: SignerWithAddress = signers[0];

    const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545/");

    const nftCollection = new ethers.Contract(_taskArgs.collection, ERC721ACollectionArtifact.abi, provider);

    const tx = await nftCollection.connect(admin).mint(1, admin.address);

    const receipt = await tx.wait();
    console.log("receipt gas used: ", receipt.gasUsed);
  });
