import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { network } from "hardhat";
import { chainToUsdcAddress } from "../../utils/constants";

export default buildModule("PaymentModule", (m) => {
  const contract = m.contract("Payment", [chainToUsdcAddress[network.name]]); // "Payment" is file name under contracts folder, 2nd param is constructor args
  return { contract };
});
