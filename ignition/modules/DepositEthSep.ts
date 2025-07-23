import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("DepositModule", (m) => {
  const constructorArgs = ["0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238"]; // usdc address on EthSep
  const contract = m.contract("Deposit", constructorArgs); // contract instance (called "future" object in hardhat)
  return { contract };
});
