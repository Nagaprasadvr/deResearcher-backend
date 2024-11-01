import { Cluster, Connection, PublicKey } from "@solana/web3.js";
import { Context } from "hono";
import solanaCrypto from "tweetnacl";
import bs58 from "bs58";
import { LOGIN_MESSAGE } from "./constants";
import * as sdk from "@/lib/sdk";
import { Prisma, PrismaClient } from "@prisma/client";
import * as beet from "@metaplex-foundation/beet";
import { peerReview } from "@/server/routes";
import { connect } from "bun";

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

const toMetadataMerkleRootString = (metadataMerkleRoot: number[]) => {
  return Buffer.from(metadataMerkleRoot).toString("utf-8");
};

const toDbPaperState = (state: sdk.PaperState) => {
  switch (state) {
    case sdk.PaperState.ApprovedToPublish:
      return "ApprovedToPublish";
    case sdk.PaperState.AwaitingPeerReview:
      return "AwaitingPeerReview";
    case sdk.PaperState.InPeerReview:
      return "InPeerReview";
    case sdk.PaperState.RequiresRevision:
      return "RequiresRevision";
    case sdk.PaperState.Minted:
      return "Minted";
    case sdk.PaperState.Published:
      return "Published";
  }
};

const toDBResearcherProfileState = (state: sdk.ResearcherProfileState) => {
  switch (state) {
    case sdk.ResearcherProfileState.Approved:
      return "Approved";
    case sdk.ResearcherProfileState.AwaitingApproval:
      return "AwaitingApproval";
    case sdk.ResearcherProfileState.Rejected:
      return "Rejected";
  }
};

export const updateResearcherProfileDb = async (
  researcherProfile: sdk.ResearcherProfile,
  db: PrismaClient
) => {
  try {
    const profile = await db.researcherProfile.findUnique({
      where: {
        researcherPubkey: researcherProfile.researcherPubkey.toBase58(),
      },
    });

    if (profile) {
      await db.researcherProfile.update({
        where: {
          researcherPubkey: researcherProfile.researcherPubkey.toBase58(),
        },
        data: {
          state: toDBResearcherProfileState(researcherProfile.state),
          totalPapersPublished: researcherProfile.totalPapersPublished,
          totalCitations: researcherProfile.totalCitations.toNumber(),
          totalReviews: researcherProfile.totalReviews,
          reputation: researcherProfile.reputation,
          metaDataMerkleRoot: toMetadataMerkleRootString(
            researcherProfile.metaDataMerkleRoot
          ),
        },
      });
    } else {
      console.error("Profile not found in DB");
    }
  } catch (e) {
    console.log(e);
  }
};

export const updateResearchPaperDb = async (
  researchPaper: sdk.ResearchPaper,
  db: PrismaClient
) => {
  try {
    const paper = await db.researchPaper.findUnique({
      where: { address: researchPaper.address.toBase58() },
    });

    if (paper) {
      await db.researchPaper.update({
        where: { address: researchPaper.address.toBase58() },
        data: {
          state: toDbPaperState(researchPaper.state),
          totalApprovals: researchPaper.totalApprovals,
          totalCitations: researchPaper.totalCitations.toNumber(),
          totalMints: researchPaper.totalMints.toNumber(),
          metaDataMerkleRoot: toMetadataMerkleRootString(
            researchPaper.metaDataMerkleRoot
          ),
        },
      });
    } else {
      console.error("Paper not found in DB");
    }
  } catch (e) {
    console.log(e);
  }
};

export const updatePeerReviewDb = async (
  peerReview: sdk.PeerReview,
  db: PrismaClient
) => {
  try {
    const review = await db.peerReview.findUnique({
      where: {
        address: peerReview.address.toBase58(),
      },
    });

    if (review) {
      await db.peerReview.update({
        where: { address: peerReview.address.toBase58() },
        data: {
          qualityOfResearch: peerReview.qualityOfResearch,
          potentialForRealWorldUseCase: peerReview.potentialForRealWorldUseCase,
          domainKnowledge: peerReview.domainKnowledge,
          practicalityOfResultObtained: peerReview.practicalityOfResultObtained,
          metaDataMerkleRoot: toMetadataMerkleRootString(
            peerReview.metaDataMerkleRoot
          ),
        },
      });
    } else {
      console.error("Review not found in DB");
    }
  } catch (e) {
    console.log(e);
  }
};

export const createResearchTokenAccountsDb = async (
  researchTokenAccount: sdk.ResearchTokenAccount,
  db: PrismaClient
) => {
  try {
    const account = await db.researchTokenAccount.findUnique({
      where: {
        address: researchTokenAccount.address.toBase58(),
      },
    });

    if (account) {
      return;
    }

    await db.researchTokenAccount.create({
      data: {
        address: researchTokenAccount.address.toBase58(),
        researcherPubkey: researchTokenAccount.researcherPubkey.toBase58(),
        paperPubkey: researchTokenAccount.paperPubkey.toBase58(),
        bump: researchTokenAccount.bump,
        researchPaper: {
          connect: {
            address: researchTokenAccount.paperPubkey.toBase58(),
          },
        },
        researcherProfile: {
          connect: {
            researcherPubkey: researchTokenAccount.researcherPubkey.toBase58(),
          },
        },
      },
    });
  } catch (e) {
    console.log(e);
  }
};
