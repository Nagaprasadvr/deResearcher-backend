import { z } from "zod";

export const CreateResearchPaperZod = z.object({
  address: z.string(),
  creatorPubkey: z.string(),
  paperContentHash: z.string(),
  accessFee: z.number(),
  metaDataMerkleRoot: z.string(),
  metadata: z.object({
    title: z.string(),
    abstract: z.string(),
    authors: z.array(z.string()),
    datePublished: z.string(),
    domain: z.string(),
    tags: z.array(z.string()),
    references: z.array(z.string()),
    paperImageURI: z.string(),
    decentralizedStorageURI: z.string(),
  }),
  bump: z.number(),
});

export const CreateResearcherProfileZod = z.object({
  address: z.string(),
  researcherPubkey: z.string(),
  bump: z.number(),
  name: z.string(),
  metaDataMerkleRoot: z.string(),
  metadata: z.object({
    email: z.string(),
    organization: z.string().optional(),
    bio: z.string().optional(),
    profileImageURI: z.string().optional(),
    backgroundImageURI: z.string().optional(),
    interests: z.array(z.string()).optional(),
    topPublications: z.array(z.string()).optional(),
    socialLinks: z.array(z.string()).optional(),
  }),
});

export const AddPeerReviewSchema = z.object({
  address: z.string(),
  reviewerPubkey: z.string(),
  paperPubkey: z.string(),
  qualityOfResearch: z.number(),
  potentialForRealWorldUseCase: z.number(),
  domainKnowledge: z.number(),
  practicalityOfResultObtained: z.number(),
  metaDataMerkleRoot: z.string(),
  metadata: z.object({
    title: z.string(),
    reviewComments: z.string(),
  }),
  bump: z.number(),
});

export const LoginAuthZod = z.object({
  walletPubkey: z.string(),
  walletSignature: z.string(),
});

export const MintResearchPaperSchema = z.object({
  address: z.string(),
  researcherPubkey: z.string(),
  paperPubkey: z.string(),
  bump: z.number(),
});

const SOLANA_PUBLIC_KEY_REGEX = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

export const validatePaperState = (state: string) => {
  return [
    "AwaitingPeerReview",
    "InPeerReview",
    "ApprovedToPublish",
    "RequiresRevision",
    "Published",
    "Minted",
  ].includes(state);
};

export const validatePublicKey = (key: string) => {
  return SOLANA_PUBLIC_KEY_REGEX.test(key);
};
