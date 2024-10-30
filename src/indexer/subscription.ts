import { usePeerReviewSubscription } from "./subscriptions/peerReview";
import { useResearchPaperSubscription } from "./subscriptions/researchPaper";
import { useResearcherProfilerSubscription } from "./subscriptions/researcherProfile";
import { useResearchTokenSubscription } from "./subscriptions/researchTokenAccount";
import { Connection } from "@solana/web3.js";
import { Subscriptions } from "src/utils/types";
import { PrismaClient } from "@prisma/client";

export const useDeResearcherSubscription = (
  connection: Connection,
  db: PrismaClient
): Subscriptions => {
  const researchPaperSub = useResearchPaperSubscription(connection, db);
  const peerReviewSub = usePeerReviewSubscription(connection, db);
  const researcherProfileSub = useResearcherProfilerSubscription(
    connection,
    db
  );
  const researchTokenAccSub = useResearchTokenSubscription(connection, db);

  const subscriptions: Subscriptions = {
    researchPaperSub,
    peerReviewSub,
    researcherProfileSub,
    researchTokenAccSub,
  };

  return subscriptions;
};
