/*
  Warnings:

  - A unique constraint covering the columns `[address]` on the table `PeerReview` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PeerReview_address_key" ON "PeerReview"("address");
