import { Cluster, Connection, PublicKey } from "@solana/web3.js";
import { Context } from "hono";
import solanaCrypto from "tweetnacl";
import bs58 from "bs58";
import { LOGIN_MESSAGE } from "./constants";

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

export const handleErr = (c: Context, error: any, message: string) => {
  if (error.name === "ValidationError") {
    return handleValidationErr(c, error);
  } else {
    return toErrorResponse(c, message);
  }
};

export const handleValidationErr = (c: Context, error: any) => {
  const validationErrors = Object.entries(error.errors).map(
    ([field, err]: [string, any]) => ({
      field,
      message: err.message,
      value: err.value,
    })
  );
  return toErrorResponse(
    c,
    "Error in validation : " + JSON.stringify(validationErrors)
  );
};

export function verifySignature(signature: string, pubkey: string) {
  return solanaCrypto.sign.detached.verify(
    getEncodedLoginMessage(pubkey),
    bs58.decode(signature),
    bs58.decode(pubkey)
  );
}

export const minimizePubkey = (pubkey: string) => {
  return pubkey.slice(0, 4) + "..." + pubkey.slice(-4);
};

export function getEncodedLoginMessage(pubkey: string) {
  return new Uint8Array(
    JSON.stringify({
      auth: LOGIN_MESSAGE,
      pubkey: minimizePubkey(pubkey),
    })
      .split("")
      .map((c) => c.charCodeAt(0))
  );
}
