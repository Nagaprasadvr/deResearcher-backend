import { Hono } from "hono";
import { toErrorResponse, toSuccessfulResponse } from "@/utils/helpers";
import { AddPeerReviewSchema } from "@/utils/validation";
import { Prisma, PrismaClient } from "@prisma/client";
import { PeerReviewType } from "@/db/ModelTypes";
import { db } from "@/db/conn";

export const route = new Hono();

const prisma = new PrismaClient();

// GET /peer-review

route.get("/", async (c) => {
  try {
    const reviewerPubkey = c.req.param("reviewerPubkey");
    const paperPubkey = c.req.param("paperPubkey");

    const dbQuery: Prisma.PeerReviewWhereInput = {};

    if (paperPubkey) {
      dbQuery.paperPubkey = paperPubkey;
    }

    if (reviewerPubkey) {
      dbQuery.reviewerPubkey = reviewerPubkey;
    }

    const peerReviews: PeerReviewType[] = await db.peerReview.findMany({
      where: dbQuery,
      include: {
        researchPaper: true,
        reviewerResearcherProfile: true,
      },
    });

    return toSuccessfulResponse(c, peerReviews);
  } catch (error: any) {
    console.log("Error in GET /api/peer-review:", error);
    return toErrorResponse(c, "Error fetching peer reviews");
  }
});

// POST /peer-review/create

route.post("/create", async (c) => {
  try {
    const unsafeData = await c.req.json();

    const parsedDataResult = AddPeerReviewSchema.safeParse(unsafeData);

    if (parsedDataResult.error) {
      return toErrorResponse(c, "Invalid data");
    }

    const safeData = parsedDataResult.data;

    // Validate that the reviewer exists
    const reviewer = await db.researcherProfile.findUnique({
      where: {
        researcherPubkey: safeData.reviewerPubkey,
      },
    });

    if (!reviewer) {
      return toErrorResponse(c, "Reviewer not found");
    }

    // Validate that the paper exists
    const paper = await db.researchPaper.findUnique({
      where: {
        address: safeData.paperPubkey,
      },
    });

    if (!paper) {
      return toErrorResponse(c, "Paper not found");
    }

    // Create the new PeerReview document
    const newPeerReview: PeerReviewType = await db.peerReview.create({
      data: {
        ...safeData,
        metadata: {
          create: safeData.metadata,
        },
        researchPaper: {
          connect: {
            address: safeData.paperPubkey,
          },
        },
        reviewerResearcherProfile: {
          connect: {
            researcherPubkey: safeData.reviewerPubkey,
          },
        },
      },
      include: {
        researchPaper: true,
        reviewerResearcherProfile: true,
      },
    });

    return toSuccessfulResponse(c, newPeerReview);
  } catch (error: any) {
    console.error("Error in POST /api/peer-reviews:", error);

    if (error.name === "ValidationError") {
      const validationErrors = Object.entries(error.errors).map(
        ([field, err]: [string, any]) => ({
          field,
          message: err.message,
          value: err.value,
        })
      );
      toErrorResponse(
        c,
        "Error in validation : " + JSON.stringify(validationErrors)
      );
    }

    return toErrorResponse(c, "Error creating Peer Review");
  }
});
