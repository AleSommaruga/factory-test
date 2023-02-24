import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";

import FactoryArtifact from "../artifacts/contracts/ERC721A/ERC721AFactory.sol/ERC721AFactory.json";

task("createCollectionA", "Create a new collection with ERC721A")
  .addParam("factory", "Factory contract address")
  .setAction(async (_taskArgs: TaskArguments, { ethers }) => {
    const signers: SignerWithAddress[] = await ethers.getSigners();
    const admin: SignerWithAddress = signers[0];

    const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545/");

    const nftCollectionsFactory = new ethers.Contract(_taskArgs.factory, FactoryArtifact.abi, provider);

    const tx = await nftCollectionsFactory.connect(admin).createCollection(admin.address);

    const receipt = await tx.wait();
    const nftCollectionProxyAddress = receipt.events
      ? receipt?.events[receipt.events.length - 1]?.args?.collection
      : ethers.constants.AddressZero;

    console.log("NFTCollection Proxy (ERC721A) deployed to: ", nftCollectionProxyAddress);
  });
