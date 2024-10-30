import {
  ResearchPaper,
  ResearchTokenAccount,
  ResearcherProfile,
  PeerReview,
} from "@prisma/client";

export type ResearchPaperType = ResearchPaper & {
  peerReviews: PeerReview[];
  researcherProfile: ResearcherProfile;
};

export type ResearchTokenAccountType = ResearchTokenAccount & {
  researchPaper: ResearchPaper;
  researcherProfile: ResearcherProfile;
};

export type ResearcherProfileType = ResearcherProfile & {
  researchTokenAccounts: ResearchTokenAccount[];
  researchPapers: ResearchPaper[];
  peerReviews: PeerReview[];
};

export type PeerReviewType = PeerReview & {
  researchPaper: ResearchPaper;
  reviewerResearcherProfile: ResearcherProfile;
};
