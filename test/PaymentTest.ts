import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect, assert } from "chai";
import { chainToUsdcAddress } from "../utils/constants";
// artifacts
import usdcArtifact from "../artifacts/contracts/interfaces/IERC20Complete.sol/IERC20Complete.json";
import paymentArtifact from "../artifacts/contracts/Payment.sol/Payment.json";

const chain = "polygon";

describe("Payment", function () {
  async function deployContractAndSetVariables() {
    // instantiate signers
    const [owner] = await ethers.getSigners(); // returns first signer of 20 provided by Hardhat
    const impersonatedSigner = await ethers.getImpersonatedSigner(process.env.CUSTOMER_ADDRESS!);

    // deploy contract & connect with impersonated signer
    const contract = await ethers.deployContract("Payment", [chainToUsdcAddress[chain]]); // hardhat ethers function, 2nd param is constructor args
    // const paymentContract = await ethers.getContractAt("Payment", contract.target.toString(), impersonatedSigner); // hardhat ethers function, toString() is needed
    const paymentContract = await ethers.getContractAtFromArtifact(paymentArtifact, contract.target.toString(), impersonatedSigner); // hardhat ethers function, toString() is needed

    return { paymentContract, owner, impersonatedSigner };
  }

  it("Deployer is the owner", async function () {
    const { paymentContract, owner } = await loadFixture(deployContractAndSetVariables); //loadFixture better than beforeEach cuz 1) using function to return vars saves declaring them globally  and 2) reset network to initial state
    const ownerOfContract = await paymentContract._owner();
    assert.equal(ownerOfContract, owner.address);
  });

  it("Emitted event", async function () {
    const { paymentContract, impersonatedSigner } = await loadFixture(deployContractAndSetVariables);
    const usdcAmount = ethers.parseUnits("6.17", 6);

    // 1. approve usdc
    const usdcContract = await ethers.getContractAtFromArtifact(usdcArtifact, chainToUsdcAddress[chain], impersonatedSigner);
    await usdcContract.approve(paymentContract.target, usdcAmount);
    const allowance = await usdcContract.allowance(impersonatedSigner.address, paymentContract.target);
    console.log("allowance:", allowance);

    // 2. call pay function on contract
    const tx = await paymentContract.pay({
      to: "0xf3D49126A9E25724CFE2Ca00bEAa34317543f9aC", // merchant1
      amount: usdcAmount,
      items: [
        "0x00000000000000010214000100000004000000000000003c00000000001e8480",
        "0x0000000000000001021400010000000100000000000000320000000000197b70",
        "0x00000000000000010214000100000003000000000000004b00000000002625a0",
      ],
    });

    // 3. log receipt
    const receipt = await tx.wait();
    if (receipt) {
      for (const log of receipt.logs) {
        console.log("log:", log);
        try {
          console.log("Topics:", log.topics); // array of topic hashes
          const parsed = paymentContract.interface.parseLog(log);
          console.log("Event:", parsed?.name);
          console.log("Args:", parsed?.args);
        } catch (err) {
          // not this contract's log — skip
        }
      }
    } else {
      throw new Error("No receipt found");
    }
  });
});
