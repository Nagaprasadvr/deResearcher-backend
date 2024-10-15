import { usePeerReviewSubscription } from "./subscriptions/peerReview";
import { useResearchPaperSubscription } from "./subscriptions/researchPaper";
import { useResearcherProfilerSubscription } from "./subscriptions/researcherProfile";
import { useResearchTokenSubscription } from "./subscriptions/researchTokenAccount";
import { Connection } from "@solana/web3.js";

export const useDeResearcherSubscription = (connection: Connection) => {
  const researchPaperSub = useResearchPaperSubscription(connection);
  const peerReviewSub = usePeerReviewSubscription(connection);
  const researcherProfileSub = useResearcherProfilerSubscription(connection);
  const researchTokenAccSub = useResearchTokenSubscription(connection);
};
