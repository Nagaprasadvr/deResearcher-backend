-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "walletSignature" TEXT NOT NULL,
    "walletPubkey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Session_walletSignature_key" ON "Session"("walletSignature");

-- CreateIndex
CREATE UNIQUE INDEX "Session_walletPubkey_key" ON "Session"("walletPubkey");
