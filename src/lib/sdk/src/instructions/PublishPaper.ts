/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

import * as beet from "@metaplex-foundation/beet";
import * as web3 from "@solana/web3.js";
import { type PublishPaper, publishPaperBeet } from "../types/PublishPaper";

/**
 * @category Instructions
 * @category PublishPaper
 * @category generated
 */
export type PublishPaperInstructionArgs = {
  publishPaper: PublishPaper;
};
/**
 * @category Instructions
 * @category PublishPaper
 * @category generated
 */
export const PublishPaperStruct = new beet.BeetArgsStruct<
  PublishPaperInstructionArgs & {
    instructionDiscriminator: number;
  }
>(
  [
    ["instructionDiscriminator", beet.u8],
    ["publishPaper", publishPaperBeet],
  ],
  "PublishPaperInstructionArgs"
);
/**
 * Accounts required by the _PublishPaper_ instruction
 *
 * @property [_writable_, **signer**] publisherAcc
 * @property [_writable_] paperPdaAcc
 * @category Instructions
 * @category PublishPaper
 * @category generated
 */
export type PublishPaperInstructionAccounts = {
  publisherAcc: web3.PublicKey;
  paperPdaAcc: web3.PublicKey;
};

export const publishPaperInstructionDiscriminator = 2;

/**
 * Creates a _PublishPaper_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category PublishPaper
 * @category generated
 */
export function createPublishPaperInstruction(
  accounts: PublishPaperInstructionAccounts,
  args: PublishPaperInstructionArgs,
  programId = new web3.PublicKey("BdtzNv4J5DSCA52xK6KLyKG5qorajuwfmJV2WivPkRsW")
) {
  const [data] = PublishPaperStruct.serialize({
    instructionDiscriminator: publishPaperInstructionDiscriminator,
    ...args,
  });
  const keys: web3.AccountMeta[] = [
    {
      pubkey: accounts.publisherAcc,
      isWritable: true,
      isSigner: true,
    },
    {
      pubkey: accounts.paperPdaAcc,
      isWritable: true,
      isSigner: false,
    },
  ];

  const ix = new web3.TransactionInstruction({
    programId,
    keys,
    data,
  });
  return ix;
}
