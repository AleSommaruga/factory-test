import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

import type { ERC721Collection, Factory, StandardFactory } from "../../types/contracts";
import type {
  ERC721Collection__factory,
  Factory__factory,
  StandardFactory__factory,
} from "../../types/factories/contracts";

task("deploy:Contracts").setAction(async function (taskArguments: TaskArguments, { ethers }) {
  const signers: SignerWithAddress[] = await ethers.getSigners();
  const admin: SignerWithAddress = signers[0];

  const masterCollectionFactory: ERC721Collection__factory = <ERC721Collection__factory>(
    await ethers.getContractFactory("ERC721Collection")
  );
  const masterCollection: ERC721Collection = <ERC721Collection>await masterCollectionFactory.connect(admin).deploy();
  await masterCollection.deployed();
  const factoryFactory: Factory__factory = <Factory__factory>await ethers.getContractFactory("Factory");
  const factory: Factory = <Factory>await factoryFactory.connect(admin).deploy(masterCollection.address);
  await factory.deployed();
  const standardFactoryFactory: StandardFactory__factory = <StandardFactory__factory>(
    await ethers.getContractFactory("StandardFactory")
  );
  const stdFactory: StandardFactory = <StandardFactory>await standardFactoryFactory.connect(admin).deploy();
  await stdFactory.deployed();

  console.log("Master copy deployed to: ", masterCollection.address);
  console.log("Factory deployed to: ", factory.address);
  console.log("Standard Factory deployed to: ", stdFactory.address);
});
