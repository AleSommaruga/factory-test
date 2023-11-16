import { expect } from "chai";

export function shouldBehaveLike721A(): void {
  it("should mint with gas reported", async function () {
    const admin = this.signers.admin;
    const receiver = this.signers.receiver;

    const quantity = 10000;
    await this.collection721A.connect(admin).mint(quantity, admin.address);
    expect(await this.collection721A.totalSupply()).to.equal(quantity);

    for (let i = 0; i < quantity; i++) {
      await this.collection721A["safeTransferFrom(address,address,uint256)"](admin.address, receiver.address, i);
    }
    expect(await this.collection721A.balanceOf(receiver.address)).to.equal(quantity);
  });
}
