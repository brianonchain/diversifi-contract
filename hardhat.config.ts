import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    hardhat: {
      forking: {
        url: process.env.POLYGON_RPC_URL!,
        blockNumber: 61320429,
      },
      chainId: 137,
    },
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL!,
      accounts: [process.env.PRIVATE_KEY!],
      chainId: 11155111,
    },
    polygon: {
      url: process.env.POLYGON_RPC_URL!,
      accounts: [process.env.PRIVATE_KEY!],
      chainId: 137,
    },
  },
};

export default config;
