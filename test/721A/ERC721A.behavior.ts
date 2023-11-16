import { expect } from "chai";
import { ethers } from "hardhat";

export function shouldBehaveLike721A(): void {
  const quantity = 12941;
  const permut = quantity > 6 ? relevantOrderings(quantity) : permutations(quantity);

  let minSumGas = Infinity;
  let maxSumGas = 0;
  let maxSumGasPerm: number[], minSumGasPerm: number[];

  let minGas = Infinity;
  let maxGas = 0;
  let maxGasPerm: number[], minGasPerm: number[];

  for (let p = 0; p < permut.length; p++) {
    it(`should mint with gas reported ${p}`, async function () {
      const admin = this.signers.admin;
      if (quantity < 7) console.log("Permut", p, ":", permut[p]);

      expect(await this.collection721A.totalSupply()).to.equal(quantity);

      let sumGas = 0;
      for (let i = 0; i < permut[p].length; i++) {
        const receiver = ethers.Wallet.createRandom();
        const tx = await this.collection721A["safeTransferFrom(address,address,uint256)"](
          admin.address,
          receiver.address,
          permut[p][i],
        );
        const gas = (await tx.wait()).gasUsed.toNumber();
        if (quantity < 7) console.log("🚀 ~ file: ERC721A.behavior.ts:23 ~ gas:", gas);

        if (gas > maxGas) {
          maxGas = gas;
          maxGasPerm = permut[p];
        } else if (gas < minGas) {
          minGas = gas;
          minGasPerm = permut[p];
        }

        sumGas += gas;
      }
      if (quantity < 7) console.log("🚀 ~ file: ERC721A.behavior.ts:26 ~ sumGas:", sumGas);
      if (permut[p].length === quantity) {
        if (sumGas > maxSumGas) {
          maxSumGas = sumGas;
          maxSumGasPerm = permut[p];
        } else if (sumGas < minSumGas) {
          minSumGas = sumGas;
          minSumGasPerm = permut[p];
        }
      }

      if (p === permut.length - 1) {
        console.log("N =", quantity);
        if (quantity <= 2000) {
          console.log("🚀 ~ maxSumGas:", maxSumGas);
          console.log("🚀 ~ minSumGas:", minSumGas);
        } else {
          console.log("🚀 ~ estimated maxSumGas:", ((maxGas + minGas) * quantity) / 2);
          console.log("🚀 ~ estimated minSumGas:", (minGas * quantity) / 2);
        }
        console.log("🚀 ~ maxGas:", maxGas);
        console.log("🚀 ~ minGas:", minGas);
        if (quantity < 7) {
          console.log("-");
          console.log("🚀 ~ maxSumGasPerm:", maxSumGasPerm);
          console.log("🚀 ~ minSumGasPerm:", minSumGasPerm);
          console.log("-");
          console.log("🚀 ~ maxGasPerm:", maxGasPerm);
          console.log("🚀 ~ minGasPerm:", minGasPerm);
        }
      }
    });
  }
}

function permutations(n: number): number[][] {
  const numbers = Array.from({ length: n }, (_, i) => i);
  const result: number[][] = [];

  function permute(array: number[], index: number) {
    if (index === n) {
      result.push([...array]);
      return;
    }

    for (let i = index; i < n; i++) {
      [array[index], array[i]] = [array[i], array[index]];
      permute(array, index + 1);
      [array[index], array[i]] = [array[i], array[index]];
    }
  }

  permute(numbers, 0);
  return result;
}

function relevantOrderings(n: number): number[][] {
  const result: number[][] = [];

  // 1. Un array con primo valore N-2 e 1 prima di 0 (max e min gas)
  const array1 = [n - 2, 1, 0];
  result.push(array1);

  if (n <= 2000) {
    const numbers = Array.from({ length: n }, (_, i) => n - i - 1);

    // 2. La copia di numbers con 1 e 0 scambiati (maxSumGas)
    const array2 = [...numbers];
    [array2[n - 2], array2[n - 1]] = [array2[n - 1], array2[n - 2]];
    result.push(array2);

    // 3. Un array costruito al crescere di N come [1, 0, 3, 2, ..., 2x+1, 2x, ...] (minSumGas)
    let array3: number[] = [];
    for (let i = 1; i < n; i += 2) {
      array3 = array3.concat([i, i - 1]);
    }
    if (n % 2 === 1) {
      array3[n - 1] = n - 1;
    }
    result.push(array3);
  }

  console.log("🚀 ~ file: ERC721A.behavior.ts:127 ~ relevantOrderings ~ result:", result);
  return result;
}
