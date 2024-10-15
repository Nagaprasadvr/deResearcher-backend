import { Cluster, Connection } from "@solana/web3.js";
import { Context } from "hono";

export const toSuccessfulResponse = (c: Context, data: any) => {
  return c.json(data, 200);
};

export const toErrorResponse = (c: Context, errorMessage: string) => {
  return c.json(
    {
      error: errorMessage,
    },
    500
  );
};

export const getConnection = (cluster: Cluster) => {
  return new Connection(getRPCUrlFromCluster(cluster), {
    commitment: "confirmed",
  });
};

export const getRPCUrlFromCluster = (cluster: Cluster) => {
  switch (cluster) {
    case "devnet":
      return "https://devnet.helius-rpc.com/?api-key=d3e8f936-41b8-4ab0-80f0-50b7f885afb3";
    case "testnet":
      return "https://testnet.helius-rpc.com/?api-key=d3e8f936-41b8-4ab0-80f0-50b7f885afb3";
    case "mainnet-beta":
      return "https://mainnet.helius-rpc.com/?api-key=d3e8f936-41b8-4ab0-80f0-50b7f885afb3";
    default:
      return "https://devnet.helius-rpc.com/?api-key=d3e8f936-41b8-4ab0-80f0-50b7f885afb3";
  }
};
