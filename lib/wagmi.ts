import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "wagmi";
import { hardhat, sepolia } from "wagmi/chains";

const chainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID ?? sepolia.id);
const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL;
const chains = chainId === hardhat.id ? [hardhat, sepolia] as const : [sepolia, hardhat] as const;

export const config = getDefaultConfig({
  appName: "Prediction Market",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
  chains,
  transports: {
    [hardhat.id]: http(rpcUrl ?? "http://127.0.0.1:8545"),
    [sepolia.id]: http(rpcUrl && chainId === sepolia.id ? rpcUrl : undefined),
  },
  ssr: true,
});
