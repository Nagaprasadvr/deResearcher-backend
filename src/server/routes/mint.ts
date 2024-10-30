import { ResearchTokenAccountType } from "src/db/ModelTypes";
import { toErrorResponse, toSuccessfulResponse } from "src/utils/helpers";
import { MintResearchPaperSchema } from "src/utils/validation";
import { Prisma, PrismaClient } from "@prisma/client";
import { Hono } from "hono";
import { db } from "src/db/conn";

export const route = new Hono();

// GET /mint

route.get("/", async (c) => {
  try {
    const researcherPubkey = c.req.query("researcherPubkey");

    const dbQuery: Prisma.ResearchTokenAccountWhereInput = {};

    if (researcherPubkey) {
      dbQuery.researcherPubkey = researcherPubkey;
    }

    const researchTokenAccounts: ResearchTokenAccountType[] =
      await db.researchTokenAccount.findMany({
        where: dbQuery,
        include: {
          researcherProfile: true,
          researchPaper: true,
        },
      });

    return toSuccessfulResponse(c, researchTokenAccounts);
  } catch (error: any) {
    return toErrorResponse(c, "Error in fetching mint collection");
  }
});

// POST /mint

route.post("/", async (c) => {
  try {
    const body = await c.req.json();

    const newResearchTokenAccount: ResearchTokenAccountType =
      await db.researchTokenAccount.create({
        data: body,
        include: {
          researcherProfile: true,
          researchPaper: true,
        },
      });

    return toSuccessfulResponse(c, newResearchTokenAccount);
  } catch (error: any) {
    return toErrorResponse(c, "Error in creating mint collection");
  }
});

// POST /mint

route.post("/", async (c) => {
  try {
    const unsafeData = await c.req.json();

    const parsedDataRes = MintResearchPaperSchema.safeParse(unsafeData);

    if (!parsedDataRes.success) {
      return toErrorResponse(c, "Invalid data");
    }

    const data = parsedDataRes.data;

    const existing = await db.researchTokenAccount.findFirst({
      where: {
        address: data.address,
      },
    });

    if (existing) {
      return toErrorResponse(c, "Research ATA already exists");
    }

    const newResearchTokenAccount: ResearchTokenAccountType =
      await db.researchTokenAccount.create({
        data: {
          ...data,
          researchPaper: {
            connect: { address: data.paperPubkey },
          },
          researcherProfile: {
            connect: { researcherPubkey: data.researcherPubkey },
          },
        },
        include: {
          researchPaper: true,
          researcherProfile: true,
        },
      });

    return toSuccessfulResponse(c, newResearchTokenAccount);
  } catch (err) {
    return toErrorResponse(c, "Error creating Research Mint Collection");
  }
});
