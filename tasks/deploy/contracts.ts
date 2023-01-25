import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

import type { ERC721Collection, Factory } from "../../types/contracts";
import type { ERC721Collection__factory, Factory__factory } from "../../types/factories/contracts";

task("deploy:Contracts").setAction(async function (taskArguments: TaskArguments, { ethers }) {
  const signers: SignerWithAddress[] = await ethers.getSigners();
  const collectionFactory: ERC721Collection__factory = <ERC721Collection__factory>(
    await ethers.getContractFactory("ERC721Collection")
  );
  const masterCollection: ERC721Collection = <ERC721Collection>await collectionFactory.connect(signers[0]).deploy();
  await masterCollection.deployed();
  const factoryFactory: Factory__factory = <Factory__factory>await ethers.getContractFactory("Factory");
  const factory: Factory = <Factory>await factoryFactory.connect(signers[0]).deploy(masterCollection.address);
  await factory.deployed();
  console.log("ERC721Collection master copy deployed to: ", masterCollection.address);
  console.log("Factory deployed to: ", factory.address);
});
