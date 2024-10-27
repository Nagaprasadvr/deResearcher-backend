import { usePeerReviewSubscription } from "./subscriptions/peerReview";
import { useResearchPaperSubscription } from "./subscriptions/researchPaper";
import { useResearcherProfilerSubscription } from "./subscriptions/researcherProfile";
import { useResearchTokenSubscription } from "./subscriptions/researchTokenAccount";
import { Connection } from "@solana/web3.js";
import { Subscriptions } from "@/utils/types";

export const useDeResearcherSubscription = (
  connection: Connection
): Subscriptions => {
  const researchPaperSub = useResearchPaperSubscription(connection);
  const peerReviewSub = usePeerReviewSubscription(connection);
  const researcherProfileSub = useResearcherProfilerSubscription(connection);
  const researchTokenAccSub = useResearchTokenSubscription(connection);

  const subscriptions: Subscriptions = {
    researchPaperSub,
    peerReviewSub,
    researcherProfileSub,
    researchTokenAccSub,
  };

  return subscriptions;
};
