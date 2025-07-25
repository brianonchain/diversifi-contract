import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect, assert } from "chai";
// artifacts
import usdcArtifact from "../artifacts/contracts/interfaces/IERC20Complete.sol/IERC20Complete.json";
import depositArtifact from "../artifacts/contracts/Deposit.sol/Deposit.json";

describe("Deposit", function () {
  async function deployContractAndSetVariables() {
    // instantiate signers
    const [owner] = await ethers.getSigners();
    const impersonatedSigner = await ethers.getImpersonatedSigner(process.env.CUSTOMER_ADDRESS!);

    // deploy contract & connect with impersonated signer
    const contract = await ethers.deployContract("Deposit", ["0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359"]); // hardhat ethers function, 2nd param is constructor args
    const depositContract = await ethers.getContractAtFromArtifact(depositArtifact, contract.target.toString(), impersonatedSigner); // hardhat ethers function, toString() is needed

    return { depositContract, owner, impersonatedSigner };
  }

  it("Deployer is the owner", async function () {
    const { depositContract, owner } = await loadFixture(deployContractAndSetVariables); //loadFixture better than beforeEach cuz 1) using function to return vars saves declaring them globally  and 2) reset network to initial state
    console.log("depositContract.target:", depositContract.target);

    const getOwner = await depositContract.getOwner();
    console.log("getOwner:", getOwner);

    const sender = await depositContract.getSender();
    console.log("sender:", sender);
    assert.equal(getOwner, owner.address);
  });

  it("Deposit amount should equal balance", async function () {
    const { depositContract, impersonatedSigner } = await loadFixture(deployContractAndSetVariables);
    const usdcAmount = ethers.parseUnits("10", 6);

    // instantiate usdc contract using artifact
    const usdcContract = await ethers.getContractAtFromArtifact(usdcArtifact, "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359", impersonatedSigner);

    // check customer address
    const userBalance = await usdcContract.balanceOf(impersonatedSigner.address);
    console.log("customerUsdcBalance:", userBalance);

    // 1. approve
    await usdcContract.approve(depositContract.target, usdcAmount);
    // check allowance is through
    const allowance = await usdcContract.allowance(impersonatedSigner.address, depositContract.target);
    console.log("allowance:", allowance);
    // check can call erc20 contract in contract
    const allowanceCalled = await depositContract.tester(); //
    console.log("called allowance:", allowanceCalled);

    // 2. deposit into contract
    await depositContract.deposit(usdcAmount);

    // 3. get balance
    const balance1 = await depositContract.getBalance(impersonatedSigner.address);
    console.log("balance1:", balance1);

    // 4. withdraw partial
    await depositContract.withdraw(ethers.parseUnits("4", 6));

    // 5. get balance
    const balance2 = await depositContract.getBalance(impersonatedSigner.address);
    console.log("balance2:", balance2);

    // 6. withdraw all
    await depositContract.withdraw(ethers.parseUnits("6", 6));

    // 7. get balance
    const balance3 = await depositContract.getBalance(impersonatedSigner.address);
    console.log("balance3:", balance3);

    assert.equal(0, balance3);
  });
});
