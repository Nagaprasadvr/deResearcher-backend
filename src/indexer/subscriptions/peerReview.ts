import {
  Connection,
  KeyedAccountInfo,
  ProgramAccountSubscriptionConfig,
} from "@solana/web3.js";

import * as sdk from "@/lib/sdk";
import { updatePeerReviewDb } from "@/utils/helpers";
import { PrismaClient } from "@prisma/client";

export const usePeerReviewSubscription = (
  connection: Connection,
  db: PrismaClient
) => {
  const filters: ProgramAccountSubscriptionConfig = {
    commitment: "confirmed",
    filters: [
      {
        dataSize: sdk.PeerReview.byteSize,
      },
    ],
  };

  const onAccountChange = async (keyedAccountInfo: KeyedAccountInfo) => {
    try {
      const [peerReview, _bytesRead] = sdk.PeerReview.fromAccountInfo(
        keyedAccountInfo.accountInfo
      );

      await updatePeerReviewDb(peerReview, db);
    } catch (e) {
      console.log(e);
    }
  };

  const subscription = connection.onProgramAccountChange(
    sdk.PROGRAM_ID,
    onAccountChange,
    filters
  );

  return subscription;
};
