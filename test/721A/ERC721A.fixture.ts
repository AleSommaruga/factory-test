import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { ethers } from "hardhat";

import type { ERC721ACollection, ERC721AFactory } from "../../types";
import type { ERC721ACollection__factory, ERC721AFactory__factory } from "../../types";

export async function deploy721AFixture(): Promise<{ factoryA: ERC721AFactory; collectionA: ERC721ACollection }> {
  const signers: SignerWithAddress[] = await ethers.getSigners();
  const admin: SignerWithAddress = signers[0];

  // * ERC721A factory
  const masterCopyAFactory: ERC721ACollection__factory = <ERC721ACollection__factory>(
    await ethers.getContractFactory("ERC721ACollection")
  );
  const masterCopyA: ERC721ACollection = <ERC721ACollection>await masterCopyAFactory.connect(admin).deploy();
  await masterCopyA.deployed();
  console.log("🚀 ~ deploy721AFixture ~ masterCopyA:", masterCopyA.address);

  const factoryAFactory: ERC721AFactory__factory = <ERC721AFactory__factory>(
    await ethers.getContractFactory("ERC721AFactory")
  );
  const factoryA: ERC721AFactory = <ERC721AFactory>await factoryAFactory.connect(admin).deploy(masterCopyA.address);
  await factoryA.deployed();
  console.log("🚀 ~ deploy721AFixture ~ factoryA:", factoryA.address);

  const tx = await factoryA.connect(admin).createCollection(admin.address);
  const receipt = await tx.wait();

  const nftCollectionProxyAddress = receipt.events
    ? receipt?.events[receipt.events.length - 1]?.args?.collection
    : ethers.constants.AddressZero;

  const collectionA = <ERC721ACollection>await ethers.getContractAt("ERC721ACollection", nftCollectionProxyAddress);
  console.log("🚀 ~ deploy721AFixture ~ collectionA:", collectionA.address);

  // * set quantity (<= 12941)
  const quantity = 1000;
  await collectionA.connect(admin).mint(quantity, admin.address);

  return { factoryA, collectionA };
}
