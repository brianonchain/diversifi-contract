export const chainToRpcUrl = {
  polygon: process.env.POLYGON_RPC_URL!,
  sepolia: process.env.SEPOLIA_RPC_URL!,
};

export const chainToChainId = {
  polygon: 137,
  sepolia: 11155111,
};

export const chainToUsdcAddress: Record<string, string> = {
  polygon: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
  sepolia: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
  base: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
};
