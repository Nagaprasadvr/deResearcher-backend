import { Hono } from "hono";
import { toSuccessfulResponse, toErrorResponse } from "api/utils/helpers";
import { MerkleTree } from "merkletreejs";
import SHA256 from "crypto-js/sha256";

function removeHexPrefix(hex: string): string {
  if (hex.startsWith("0x")) {
    return hex.slice(2, hex.length);
  }
  return hex;
}

function generateMerkleRoot(data: Object): string {
  const objValues = Object.values(data);

  const merkelLeaves: string[] = [];

  for (let i = 0; i < objValues.length; i++) {
    const obj = objValues[i];

    // If the object is an array, hash the array and add the hash to the merkleLeaves
    if (Array.isArray(obj)) {
      const merkleLeaves = obj.map((item): string => {
        if (typeof item !== "string") {
          return item.toString();
        }
        return item;
      });
      let hashedMerkleRoot = new MerkleTree(merkleLeaves, SHA256).getHexRoot();

      hashedMerkleRoot = removeHexPrefix(hashedMerkleRoot);

      merkelLeaves.push(hashedMerkleRoot);
    }

    merkelLeaves.push(SHA256(obj.toString()).toString());
  }

  const hashedMerkleRoot = new MerkleTree(merkelLeaves, SHA256).getHexRoot();

  return hashedMerkleRoot;
}

export const route = new Hono();

// POST /merkle-tree/generate

route.post("/generate", async (c) => {
  try {
    const data: Object = await c.req.json();

    const merkleRoot = removeHexPrefix(generateMerkleRoot(data));

    return toSuccessfulResponse(c, merkleRoot);
  } catch (error: any) {
    return toErrorResponse(c, "Error in generating merkle root");
  }
});
