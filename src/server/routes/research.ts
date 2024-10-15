import { Hono } from "hono";
import { toSuccessfulResponse, toErrorResponse } from "@/utils/helpers";
import { PrismaClient, Prisma } from "@prisma/client";

export const route = new Hono();

const prisma = new PrismaClient();

// route for /research

// GET /research
route.get("/", async (c) => {
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

  const papers = await prisma.researchPaper.findMany({
    where: dbQuery,
    include: {
      peerReviews: true,
      reseachTokenAccounts: true,
      researcherProfile: true,
    },
  });

  return toSuccessfulResponse(c, papers);
});
