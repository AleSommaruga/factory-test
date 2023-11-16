import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { ethers } from "hardhat";

import type { Signers } from "../types";
import { shouldBehaveLike721A } from "./ERC721A.behavior";
import { deploy721AFixture } from "./ERC721A.fixture";

describe("Unit tests", function () {
  before(async function () {
    this.signers = {} as Signers;

    const signers: SignerWithAddress[] = await ethers.getSigners();
    this.signers.admin = signers[0];
    this.signers.receiver = signers[1];

    this.loadFixture = loadFixture;
  });

  describe("721A", function () {
    beforeEach(async function () {
      const { factoryA, collectionA } = await this.loadFixture(deploy721AFixture);
      this.factory721A = factoryA;
      this.collection721A = collectionA;
    });

    shouldBehaveLike721A();
  });
});
