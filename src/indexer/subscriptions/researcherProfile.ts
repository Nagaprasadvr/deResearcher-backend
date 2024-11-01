import {
  Connection,
  KeyedAccountInfo,
  ProgramAccountSubscriptionConfig,
} from "@solana/web3.js";

import * as sdk from "@/lib/sdk";
import { PrismaClient } from "@prisma/client";
import { updateResearcherProfileDb } from "@/utils/helpers";

export const useResearcherProfilerSubscription = (
  connection: Connection,
  db: PrismaClient
) => {
  const filters: ProgramAccountSubscriptionConfig = {
    commitment: "confirmed",
    filters: [
      {
        dataSize: sdk.ResearcherProfile.byteSize,
      },
    ],
  };

  const onAccountChange = async (keyedAccountInfo: KeyedAccountInfo) => {
    try {
      const [researcherProfile, _bytesRead] =
        sdk.ResearcherProfile.fromAccountInfo(keyedAccountInfo.accountInfo);

      await updateResearcherProfileDb(researcherProfile, db);
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
