import {
  Connection,
  KeyedAccountInfo,
  ProgramAccountSubscriptionConfig,
} from "@solana/web3.js";

import * as sdk from "api/lib/sdk";
import { updateResearchPaperDb } from "api/utils/helpers";
import { PrismaClient } from "@prisma/client";

export const useResearchPaperSubscription = (
  connection: Connection,
  db: PrismaClient
) => {
  const filters: ProgramAccountSubscriptionConfig = {
    commitment: "confirmed",
    filters: [
      {
        dataSize: sdk.ResearchPaper.byteSize,
      },
    ],
  };

  const onAccountChange = async (keyedAccountInfo: KeyedAccountInfo) => {
    try {
      const [researchPaper, _bytesRead] = sdk.ResearchPaper.fromAccountInfo(
        keyedAccountInfo.accountInfo
      );

      await updateResearchPaperDb(researchPaper, db);
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
