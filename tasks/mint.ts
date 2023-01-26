import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";

import ERC721CollectionArtifact from "../artifacts/contracts/ERC721Collection.sol/ERC721Collection.json";

task("mint", "Mint on a collection")
  .addParam("collection", "ERC721Collection contract address")
  .setAction(async (_taskArgs: TaskArguments, { ethers }) => {
    const signers: SignerWithAddress[] = await ethers.getSigners();
    const admin: SignerWithAddress = signers[0];

    const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545/");

    const nftCollection = new ethers.Contract(_taskArgs.collection, ERC721CollectionArtifact.abi, provider);

    const tx = await nftCollection.connect(admin).safeMint(admin.address, 4);

    const receipt = await tx.wait();
    console.log("receipt gas used: ", receipt.gasUsed);
  });
