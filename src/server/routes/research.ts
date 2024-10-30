import { Hono } from "hono";
import {
  toSuccessfulResponse,
  handleErr,
  toErrorResponse,
} from "@/utils/helpers";
import { PrismaClient, Prisma, PaperState } from "@prisma/client";
import {
  CreateResearchPaperZod,
  validatePaperState,
  validatePublicKey,
} from "@/utils/validation";
import { ResearchPaperType } from "@/db/ModelTypes";
import { db } from "@/db/conn";

export const route = new Hono();

// route for /research

// GET /research
route.get("/", async (c) => {
  try {
    const queryParams = c.req.query();

    const dbQuery: Prisma.ResearchPaperWhereInput = {};

    if (queryParams.paperPubkey) {
      dbQuery.address = queryParams.paperPubkey;
    }

    if (queryParams.researcherPubkey) {
      dbQuery.creatorPubkey = queryParams.researcherPubkey;
    }

    if (queryParams.researchPaperstate) {
      dbQuery.state = queryParams.research as Prisma.EnumPaperStateFilter;
    }

    const papers: ResearchPaperType[] = await db.researchPaper.findMany({
      where: dbQuery,
      include: {
        peerReviews: true,
        reseachTokenAccounts: true,
        researcherProfile: true,
      },
    });

    return toSuccessfulResponse(c, papers);
  } catch (error: any) {
    return toErrorResponse(c, "Error in fetching research papers");
  }
});

// GET /research/:status/:paperPubkey
route.get("/:status/:paperPubkey", async (c) => {
  try {
    const status = c.req.param("status");
    const paperPubkey = c.req.param("paperPubkey");

    if (!status || !paperPubkey) {
      return toErrorResponse(
        c,
        "Invalid params for fetching research paper please provide status and paperPubkey"
      );
    }

    if (!validatePublicKey(paperPubkey)) {
      return toErrorResponse(c, "Invalid paper pubkey");
    }

    if (!validatePaperState(status)) {
      return toErrorResponse(c, "Invalid paper state");
    }

    const paper: ResearchPaperType | null = await db.researchPaper.findFirst({
      where: {
        address: paperPubkey,
        state: status as Prisma.EnumPaperStateFilter,
      },
      include: {
        peerReviews: true,
        reseachTokenAccounts: true,
        researcherProfile: true,
      },
    });

    if (!paper) {
      return toErrorResponse(
        c,
        "No paper found with the given pubkey and state"
      );
    }

    return toSuccessfulResponse(c, paper);
  } catch (error: any) {
    return toErrorResponse(c, "Error in fetching research paper");
  }
});

// POST /research/create
route.post("/create", async (c) => {
  try {
    const unsafeData = await c.req.json();

    const parsedDataResult = CreateResearchPaperZod.safeParse(unsafeData);

    if (parsedDataResult.error) {
      return toErrorResponse(c, "Invalid data");
    }

    const safeData = parsedDataResult.data;

    const paper: ResearchPaperType = await db.researchPaper.create({
      data: {
        address: safeData.address,
        creatorPubkey: safeData.creatorPubkey,
        paperContentHash: safeData.paperContentHash,
        accessFee: safeData.accessFee,
        metaDataMerkleRoot: safeData.metaDataMerkleRoot,
        bump: safeData.bump,
        state: PaperState.AwaitingPeerReview,
        metadata: {
          create: {
            ...safeData.metadata,
          },
        },
        researcherProfile: {
          connect: {
            address: safeData.creatorPubkey,
          },
        },
      },
      include: {
        peerReviews: true,
        researcherProfile: true,
      },
    });

    return toSuccessfulResponse(c, paper);
  } catch (error: any) {
    return handleErr(c, error, "Error in creating research paper");
  }
});
