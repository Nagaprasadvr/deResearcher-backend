export type Subscriptions = {
  researchPaperSub: number;
  peerReviewSub: number;
  researcherProfileSub: number;
  researchTokenAccSub: number;
};

export const PaperState = {
  AwaitingPeerReview: "AwaitingPeerReview",
  InPeerReview: "InPeerReview",
  ApprovedToPublish: "ApprovedToPublish",
  RequiresRevision: "RequiresRevision",
  Published: "Published",
  Minted: "Minted",
};
