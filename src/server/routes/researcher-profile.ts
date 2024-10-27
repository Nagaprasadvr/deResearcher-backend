import { ResearcherProfileType } from "@/db/ModelTypes";
import { toErrorResponse, toSuccessfulResponse } from "@/utils/helpers";
import {
  CreateResearcherProfileZod,
  validatePublicKey,
} from "@/utils/validation";
import { Prisma, PrismaClient, ResearcherProfileState } from "@prisma/client";
import { Hono } from "hono";

export const route = new Hono();

const prisma = new PrismaClient();

// GET /researcher-profile

route.get("/", async (c) => {
  try {
    const queryParams = c.req.query();

    const dbQuery: Prisma.ResearcherProfileWhereInput = {};

    if (queryParams.researcherPubkey) {
      dbQuery.address = queryParams.researcherPubkey;
    }

    const researcherProfile: ResearcherProfileType[] =
      await prisma.researcherProfile.findMany({
        where: dbQuery,
        include: {
          metadata: true,
          researchPapers: true,
          peerReviews: true,
          researchTokenAccounts: true,
        },
      });

    if (!researcherProfile || researcherProfile.length === 0) {
      return toErrorResponse(c, "Researcher profile not found");
    }

    return toSuccessfulResponse(c, researcherProfile);
  } catch (error: any) {
    return toErrorResponse(c, "Error in fetching researcher profile");
  }
});

// GET /researcher-profile/:pubkey

route.get("/:pubkey", async (c) => {
  try {
    const pubkey = c.req.param("pubkey");

    const researcherProfile: ResearcherProfileType | null =
      await prisma.researcherProfile.findUnique({
        where: {
          researcherPubkey: pubkey,
        },
        include: {
          metadata: true,
          researchPapers: true,
          peerReviews: true,
          researchTokenAccounts: true,
        },
      });

    if (!researcherProfile) {
      return toErrorResponse(c, "Researcher profile not found");
    }

    return toSuccessfulResponse(c, researcherProfile);
  } catch (error: any) {
    return toErrorResponse(c, "Error in fetching researcher profile");
  }
});

// POST /researcher-profile/create

route.post("/create", async (c) => {
  try {
    const unsafeData = await c.req.json();
    const parsedDataResult = CreateResearcherProfileZod.safeParse(unsafeData);

    if (parsedDataResult.error) {
      return toErrorResponse(c, "Invalid data");
    }

    const safeData = parsedDataResult.data;

    if (!validatePublicKey(safeData.researcherPubkey)) {
      return toErrorResponse(c, "Invalid public key");
    }

    const researcherProfile: ResearcherProfileType =
      await prisma.researcherProfile.create({
        data: {
          address: safeData.address,
          researcherPubkey: safeData.researcherPubkey,
          bump: safeData.bump,
          name: safeData.name,
          state: ResearcherProfileState.AwaitingApproval,
          metaDataMerkleRoot: safeData.metaDataMerkleRoot,
          metadata: {
            create: safeData.metadata,
          },
        },
        include: {
          researchPapers: true,
          researchTokenAccounts: true,
          peerReviews: true,
        },
      });

    return toSuccessfulResponse(c, researcherProfile);
  } catch (error: any) {
    return toErrorResponse(c, "Error in creating researcher profile");
  }
});
