/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

import * as web3 from '@solana/web3.js'
import * as beet from '@metaplex-foundation/beet'
import * as beetSolana from '@metaplex-foundation/beet-solana'
import {
  ResearcherProfileState,
  researcherProfileStateBeet,
} from '../types/ResearcherProfileState'

/**
 * Arguments used to create {@link ResearcherProfile}
 * @category Accounts
 * @category generated
 */
export type ResearcherProfileArgs = {
  address: web3.PublicKey
  researcherPubkey: web3.PublicKey
  name: number[] /* size: 64 */
  state: ResearcherProfileState
  totalPapersPublished: beet.bignum
  totalCitations: beet.bignum
  totalReviews: beet.bignum
  reputation: number
  metaDataMerkleRoot: number[] /* size: 64 */
  bump: number
}
/**
 * Holds the data for the {@link ResearcherProfile} Account and provides de/serialization
 * functionality for that data
 *
 * @category Accounts
 * @category generated
 */
export class ResearcherProfile implements ResearcherProfileArgs {
  private constructor(
    readonly address: web3.PublicKey,
    readonly researcherPubkey: web3.PublicKey,
    readonly name: number[] /* size: 64 */,
    readonly state: ResearcherProfileState,
    readonly totalPapersPublished: beet.bignum,
    readonly totalCitations: beet.bignum,
    readonly totalReviews: beet.bignum,
    readonly reputation: number,
    readonly metaDataMerkleRoot: number[] /* size: 64 */,
    readonly bump: number
  ) {}

  /**
   * Creates a {@link ResearcherProfile} instance from the provided args.
   */
  static fromArgs(args: ResearcherProfileArgs) {
    return new ResearcherProfile(
      args.address,
      args.researcherPubkey,
      args.name,
      args.state,
      args.totalPapersPublished,
      args.totalCitations,
      args.totalReviews,
      args.reputation,
      args.metaDataMerkleRoot,
      args.bump
    )
  }

  /**
   * Deserializes the {@link ResearcherProfile} from the data of the provided {@link web3.AccountInfo}.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static fromAccountInfo(
    accountInfo: web3.AccountInfo<Buffer>,
    offset = 0
  ): [ResearcherProfile, number] {
    return ResearcherProfile.deserialize(accountInfo.data, offset)
  }

  /**
   * Retrieves the account info from the provided address and deserializes
   * the {@link ResearcherProfile} from its data.
   *
   * @throws Error if no account info is found at the address or if deserialization fails
   */
  static async fromAccountAddress(
    connection: web3.Connection,
    address: web3.PublicKey,
    commitmentOrConfig?: web3.Commitment | web3.GetAccountInfoConfig
  ): Promise<ResearcherProfile> {
    const accountInfo = await connection.getAccountInfo(
      address,
      commitmentOrConfig
    )
    if (accountInfo == null) {
      throw new Error(`Unable to find ResearcherProfile account at ${address}`)
    }
    return ResearcherProfile.fromAccountInfo(accountInfo, 0)[0]
  }

  /**
   * Provides a {@link web3.Connection.getProgramAccounts} config builder,
   * to fetch accounts matching filters that can be specified via that builder.
   *
   * @param programId - the program that owns the accounts we are filtering
   */
  static gpaBuilder(
    programId: web3.PublicKey = new web3.PublicKey(
      'BdtzNv4J5DSCA52xK6KLyKG5qorajuwfmJV2WivPkRsW'
    )
  ) {
    return beetSolana.GpaBuilder.fromStruct(programId, researcherProfileBeet)
  }

  /**
   * Deserializes the {@link ResearcherProfile} from the provided data Buffer.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static deserialize(buf: Buffer, offset = 0): [ResearcherProfile, number] {
    return researcherProfileBeet.deserialize(buf, offset)
  }

  /**
   * Serializes the {@link ResearcherProfile} into a Buffer.
   * @returns a tuple of the created Buffer and the offset up to which the buffer was written to store it.
   */
  serialize(): [Buffer, number] {
    return researcherProfileBeet.serialize(this)
  }

  /**
   * Returns the byteSize of a {@link Buffer} holding the serialized data of
   * {@link ResearcherProfile}
   */
  static get byteSize() {
    return researcherProfileBeet.byteSize
  }

  /**
   * Fetches the minimum balance needed to exempt an account holding
   * {@link ResearcherProfile} data from rent
   *
   * @param connection used to retrieve the rent exemption information
   */
  static async getMinimumBalanceForRentExemption(
    connection: web3.Connection,
    commitment?: web3.Commitment
  ): Promise<number> {
    return connection.getMinimumBalanceForRentExemption(
      ResearcherProfile.byteSize,
      commitment
    )
  }

  /**
   * Determines if the provided {@link Buffer} has the correct byte size to
   * hold {@link ResearcherProfile} data.
   */
  static hasCorrectByteSize(buf: Buffer, offset = 0) {
    return buf.byteLength - offset === ResearcherProfile.byteSize
  }

  /**
   * Returns a readable version of {@link ResearcherProfile} properties
   * and can be used to convert to JSON and/or logging
   */
  pretty() {
    return {
      address: this.address.toBase58(),
      researcherPubkey: this.researcherPubkey.toBase58(),
      name: this.name,
      state: 'ResearcherProfileState.' + ResearcherProfileState[this.state],
      totalPapersPublished: (() => {
        const x = <{ toNumber: () => number }>this.totalPapersPublished
        if (typeof x.toNumber === 'function') {
          try {
            return x.toNumber()
          } catch (_) {
            return x
          }
        }
        return x
      })(),
      totalCitations: (() => {
        const x = <{ toNumber: () => number }>this.totalCitations
        if (typeof x.toNumber === 'function') {
          try {
            return x.toNumber()
          } catch (_) {
            return x
          }
        }
        return x
      })(),
      totalReviews: (() => {
        const x = <{ toNumber: () => number }>this.totalReviews
        if (typeof x.toNumber === 'function') {
          try {
            return x.toNumber()
          } catch (_) {
            return x
          }
        }
        return x
      })(),
      reputation: this.reputation,
      metaDataMerkleRoot: this.metaDataMerkleRoot,
      bump: this.bump,
    }
  }
}

/**
 * @category Accounts
 * @category generated
 */
export const researcherProfileBeet = new beet.BeetStruct<
  ResearcherProfile,
  ResearcherProfileArgs
>(
  [
    ['address', beetSolana.publicKey],
    ['researcherPubkey', beetSolana.publicKey],
    ['name', beet.uniformFixedSizeArray(beet.u8, 64)],
    ['state', researcherProfileStateBeet],
    ['totalPapersPublished', beet.u64],
    ['totalCitations', beet.u64],
    ['totalReviews', beet.u64],
    ['reputation', beet.u8],
    ['metaDataMerkleRoot', beet.uniformFixedSizeArray(beet.u8, 64)],
    ['bump', beet.u8],
  ],
  ResearcherProfile.fromArgs,
  'ResearcherProfile'
)
