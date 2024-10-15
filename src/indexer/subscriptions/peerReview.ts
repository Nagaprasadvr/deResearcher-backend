import {
  Connection,
  KeyedAccountInfo,
  ProgramAccountSubscriptionConfig,
} from "@solana/web3.js";

import * as sdk from "@/lib/sdk";

export const usePeerReviewSubscription = (connection: Connection) => {
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

      // push to DB
      // check if the researcherProfile is already in the DB
      // then accordingly update or insert
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
