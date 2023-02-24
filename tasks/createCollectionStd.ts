import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";

import StdFactoryArtifact from "../artifacts/contracts/StandardFactory/StandardFactory.sol/StandardFactory.json";

task("createCollectionStd", "Create a new collection with the standard factory pattern")
  .addParam("factory", "Factory contract address")
  .setAction(async (_taskArgs: TaskArguments, { ethers }) => {
    const signers: SignerWithAddress[] = await ethers.getSigners();
    const admin: SignerWithAddress = signers[0];

    const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545/");

    const nftCollectionsStdFactory = new ethers.Contract(_taskArgs.factory, StdFactoryArtifact.abi, provider);

    const tx = await nftCollectionsStdFactory.connect(admin).createCollection(admin.address);

    const receipt = await tx.wait();
    const nftCollectionAddress = receipt.events ? receipt?.events[2]?.args?.collection : ethers.constants.AddressZero;

    console.log("NFTCollection deployed to: ", nftCollectionAddress);
  });
