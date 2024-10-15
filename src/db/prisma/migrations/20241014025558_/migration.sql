-- CreateEnum
CREATE TYPE "ResearcherProfileState" AS ENUM ('AwaitingApproval', 'Approved', 'Rejected');

-- CreateEnum
CREATE TYPE "PaperState" AS ENUM ('AwaitingPeerReview', 'InPeerReview', 'ApprovedToPublish', 'RequiresRevision', 'Published', 'Minted');

-- CreateTable
CREATE TABLE "PeerReview" (
    "id" TEXT NOT NULL,
    "metadataId" TEXT NOT NULL,
    "reviewerResearcherProfileId" TEXT NOT NULL,
    "researhPaperId" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "reviewerPubkey" TEXT NOT NULL,
    "paperPubkey" TEXT NOT NULL,
    "qualityOfResearch" INTEGER NOT NULL DEFAULT 0,
    "potentialForRealWorldUseCase" INTEGER NOT NULL DEFAULT 0,
    "domainKnowledge" INTEGER NOT NULL DEFAULT 0,
    "practicalityOfResultObtained" INTEGER NOT NULL DEFAULT 0,
    "metaDataMerkleRoot" VARCHAR(64) NOT NULL,
    "bump" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PeerReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PeerReviewMetadata" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "reviewComments" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PeerReviewMetadata_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResearcherProfile" (
    "id" TEXT NOT NULL,
    "metadataId" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "researcherPubkey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "state" "ResearcherProfileState" NOT NULL,
    "totalPapersPublished" INTEGER DEFAULT 0,
    "totalCitations" INTEGER DEFAULT 0,
    "totalReviews" INTEGER DEFAULT 0,
    "reputation" INTEGER DEFAULT 0,
    "metaDataMerkleRoot" VARCHAR(64) NOT NULL,
    "bump" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResearcherProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResearcherProfileMetadata" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "organization" TEXT,
    "bio" TEXT,
    "profileImageURI" TEXT,
    "backgroundImageURI" TEXT,
    "externalResearchProfiles" TEXT[],
    "interestedDomains" TEXT[],
    "topPublications" TEXT[],
    "socialLinks" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResearcherProfileMetadata_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResearchPaper" (
    "id" TEXT NOT NULL,
    "metadataId" TEXT NOT NULL,
    "researcherProfileId" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "creatorPubkey" TEXT NOT NULL,
    "state" "PaperState" NOT NULL,
    "accessFee" DOUBLE PRECISION NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 0,
    "paperContentHash" VARCHAR(64) NOT NULL,
    "totalApprovals" INTEGER NOT NULL DEFAULT 0,
    "totalCitations" INTEGER NOT NULL DEFAULT 0,
    "totalMints" INTEGER NOT NULL DEFAULT 0,
    "metaDataMerkleRoot" VARCHAR(64) NOT NULL,
    "bump" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResearchPaper_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaperMetadata" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "abstract" TEXT NOT NULL,
    "authors" TEXT[],
    "datePublished" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "tags" TEXT[],
    "references" TEXT[],
    "paperImageURI" TEXT,
    "decentralizedStorageURI" TEXT NOT NULL,

    CONSTRAINT "PaperMetadata_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResearchTokenAccount" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "researchPaperId" TEXT NOT NULL,
    "researcherProfileId" TEXT NOT NULL,
    "researcherPubkey" TEXT NOT NULL,
    "paperPubkey" TEXT NOT NULL,
    "bump" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ResearchTokenAccount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PeerReview_metadataId_key" ON "PeerReview"("metadataId");

-- CreateIndex
CREATE UNIQUE INDEX "ResearcherProfile_metadataId_key" ON "ResearcherProfile"("metadataId");

-- CreateIndex
CREATE UNIQUE INDEX "ResearcherProfile_address_key" ON "ResearcherProfile"("address");

-- CreateIndex
CREATE UNIQUE INDEX "ResearcherProfile_researcherPubkey_key" ON "ResearcherProfile"("researcherPubkey");

-- CreateIndex
CREATE UNIQUE INDEX "ResearchPaper_metadataId_key" ON "ResearchPaper"("metadataId");

-- CreateIndex
CREATE UNIQUE INDEX "ResearchPaper_address_key" ON "ResearchPaper"("address");

-- CreateIndex
CREATE UNIQUE INDEX "ResearchPaper_paperContentHash_key" ON "ResearchPaper"("paperContentHash");

-- CreateIndex
CREATE UNIQUE INDEX "ResearchTokenAccount_address_key" ON "ResearchTokenAccount"("address");

-- CreateIndex
CREATE UNIQUE INDEX "ResearchTokenAccount_researcherPubkey_paperPubkey_key" ON "ResearchTokenAccount"("researcherPubkey", "paperPubkey");

-- AddForeignKey
ALTER TABLE "PeerReview" ADD CONSTRAINT "PeerReview_metadataId_fkey" FOREIGN KEY ("metadataId") REFERENCES "PeerReviewMetadata"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PeerReview" ADD CONSTRAINT "PeerReview_reviewerResearcherProfileId_fkey" FOREIGN KEY ("reviewerResearcherProfileId") REFERENCES "ResearcherProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PeerReview" ADD CONSTRAINT "PeerReview_researhPaperId_fkey" FOREIGN KEY ("researhPaperId") REFERENCES "ResearchPaper"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResearcherProfile" ADD CONSTRAINT "ResearcherProfile_metadataId_fkey" FOREIGN KEY ("metadataId") REFERENCES "ResearcherProfileMetadata"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResearchPaper" ADD CONSTRAINT "ResearchPaper_metadataId_fkey" FOREIGN KEY ("metadataId") REFERENCES "PaperMetadata"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResearchPaper" ADD CONSTRAINT "ResearchPaper_researcherProfileId_fkey" FOREIGN KEY ("researcherProfileId") REFERENCES "ResearcherProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResearchTokenAccount" ADD CONSTRAINT "ResearchTokenAccount_researchPaperId_fkey" FOREIGN KEY ("researchPaperId") REFERENCES "ResearchPaper"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResearchTokenAccount" ADD CONSTRAINT "ResearchTokenAccount_researcherProfileId_fkey" FOREIGN KEY ("researcherProfileId") REFERENCES "ResearcherProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
