import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("DepositModule", (m) => {
  const constructorArgs = ["0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359"]; // usdc address on EthSep
  const contract = m.contract("Deposit", constructorArgs); // contract instance (called "future" object in hardhat)
  return { contract };
});
