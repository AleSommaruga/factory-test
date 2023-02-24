import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

import type {
  ERC721ACollection,
  ERC721ACollection__factory,
  ERC721AFactory,
  ERC721AFactory__factory,
  ERC721Collection,
  ERC721Collection__factory,
  Factory,
  Factory__factory,
  StandardFactory,
  StandardFactory__factory,
} from "../../types";

task("deploy:Contracts").setAction(async function (taskArguments: TaskArguments, { ethers }) {
  const signers: SignerWithAddress[] = await ethers.getSigners();
  const admin: SignerWithAddress = signers[0];

  // * ERC721 cloned factory
  const masterCopyFactory: ERC721Collection__factory = <ERC721Collection__factory>(
    await ethers.getContractFactory("ERC721Collection")
  );
  const masterCopy: ERC721Collection = <ERC721Collection>await masterCopyFactory.connect(admin).deploy();
  await masterCopy.deployed();
  const factoryFactory: Factory__factory = <Factory__factory>await ethers.getContractFactory("Factory");
  const factory: Factory = <Factory>await factoryFactory.connect(admin).deploy(masterCopy.address);
  await factory.deployed();

  // * ERC721-A cloned factory
  const masterCopyAFactory: ERC721ACollection__factory = <ERC721ACollection__factory>(
    await ethers.getContractFactory("ERC721ACollection")
  );
  const masterCopyA: ERC721ACollection = <ERC721ACollection>await masterCopyAFactory.connect(admin).deploy();
  await masterCopyA.deployed();
  const factoryAFactory: ERC721AFactory__factory = <ERC721AFactory__factory>(
    await ethers.getContractFactory("ERC721AFactory")
  );
  const factoryA: ERC721AFactory = <ERC721AFactory>await factoryAFactory.connect(admin).deploy(masterCopyA.address);
  await factoryA.deployed();

  // * standard factory
  const standardFactoryFactory: StandardFactory__factory = <StandardFactory__factory>(
    await ethers.getContractFactory("StandardFactory")
  );
  const stdFactory: StandardFactory = <StandardFactory>await standardFactoryFactory.connect(admin).deploy();
  await stdFactory.deployed();

  console.log("Master copy deployed to: ", masterCopy.address);
  console.log("Factory deployed to: ", factory.address);
  console.log("Master copy (ERC721A) deployed to: ", masterCopyA.address);
  console.log("Factory (ERC721A) deployed to: ", factoryA.address);
  console.log("Standard Factory deployed to: ", stdFactory.address);
});
