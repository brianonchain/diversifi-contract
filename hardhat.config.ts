import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";
import { chainToRpcUrl, chainToChainId } from "./utils/constants";

const forkedNetwork = "polygon";

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    hardhat: {
      forking: {
        url: chainToRpcUrl[forkedNetwork],
      },
      chainId: chainToChainId[forkedNetwork],
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
  etherscan: {
    apiKey: {
      sepolia: process.env.ETHERSCAN_API_KEY!,
      polygon: process.env.POLYGONSCAN_API_KEY!,
    },
  },
};

export default config;
