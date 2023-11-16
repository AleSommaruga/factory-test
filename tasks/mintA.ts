import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";

import ERC721ACollectionArtifact from "../artifacts/contracts/ERC721A/ERC721ACollection.sol/ERC721ACollection.json";
import { ERC721ACollection } from "../types";

task("mintA", "Mint on a ERC721A collection")
  .addParam("collection", "ERC721ACollection contract address")
  .setAction(async (_taskArgs: TaskArguments, { ethers }) => {
    const signers: SignerWithAddress[] = await ethers.getSigners();
    const admin = signers[0];
    // const receiver = signers[1];

    const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545/");

    const nftCollection = <ERC721ACollection>(
      new ethers.Contract(_taskArgs.collection, ERC721ACollectionArtifact.abi, provider)
    );

    const quantity = 1000;
    const tx = await nftCollection.connect(admin).mint(quantity, admin.address);

    const receipt = await tx.wait();
    console.log("receipt gas used: ", receipt.gasUsed);

    // for (let i = 0; i < quantity; i++) {
    //   const receiptTx = await (
    //     await nftCollection["safeTransferFrom(address,address,uint256)"](admin.address, receiver.address, i)
    //   ).wait();
    //   console.log("tx [", i, "]", receiptTx.status);
    // }
  });
