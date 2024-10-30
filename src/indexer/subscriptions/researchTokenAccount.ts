import {
  Connection,
  KeyedAccountInfo,
  ProgramAccountSubscriptionConfig,
} from "@solana/web3.js";

import * as sdk from "src/lib/sdk";
import { createResearchTokenAccountsDb } from "src/utils/helpers";
import { PrismaClient } from "@prisma/client";

export const useResearchTokenSubscription = (
  connection: Connection,
  db: PrismaClient
) => {
  const filters: ProgramAccountSubscriptionConfig = {
    commitment: "confirmed",
    filters: [
      {
        dataSize: sdk.ResearchTokenAccount.byteSize,
      },
    ],
  };

  const onAccountChange = async (keyedAccountInfo: KeyedAccountInfo) => {
    try {
      const [researchTokenAccount, _bytesRead] =
        sdk.ResearchTokenAccount.fromAccountInfo(keyedAccountInfo.accountInfo);

      await createResearchTokenAccountsDb(researchTokenAccount, db);
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
