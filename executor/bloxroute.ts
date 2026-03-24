import axios, { AxiosResponse } from "axios";
import { Connection, Keypair, VersionedTransaction, TransactionMessage, SystemProgram, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { RPC_ENDPOINT, RPC_WEBSOCKET_ENDPOINT, BLOXROUTE_AUTH_TOKEN, BLOXROUTE_SUBMIT_BATCH_URL, BLOXROUTE_TIP_ACCOUNTS, BLOXROUTE_TIP_AMOUNT_SOL } from "../constants";

const solanaConnection = new Connection(RPC_ENDPOINT, {
  wsEndpoint: RPC_WEBSOCKET_ENDPOINT,
});

/**
 * Get a random BloxRoute tip account
 */
const getTipAccount = (): string => {
  const randomIndex = Math.floor(Math.random() * BLOXROUTE_TIP_ACCOUNTS.length);
  const tipAccount = BLOXROUTE_TIP_ACCOUNTS[randomIndex];
  if (!tipAccount) {
    throw new Error("BloxRoute: no tip accounts available");
  }
  return tipAccount;
};

/**
 * Create a tip transaction for BloxRoute
 */
const createTipTransaction = async (payer: Keypair): Promise<VersionedTransaction> => {
  const tipAccount = getTipAccount();
  const tipInstruction = SystemProgram.transfer({
    fromPubkey: payer.publicKey,
    toPubkey: new PublicKey(tipAccount),
    lamports: Math.floor(BLOXROUTE_TIP_AMOUNT_SOL * LAMPORTS_PER_SOL),
  });

  const { blockhash } = await solanaConnection.getLatestBlockhash();

  const messageV0 = new TransactionMessage({
    payerKey: payer.publicKey,
    recentBlockhash: blockhash,
    instructions: [tipInstruction],
  }).compileToV0Message();

  const transaction = new VersionedTransaction(messageV0);
  transaction.sign([payer]);

  return transaction;
};

/**
 * Send bundle via BloxRoute submit-batch API
 */
export const sendBundleBloxRoute = async (
  transactions: VersionedTransaction[],
  payer: Keypair
): Promise<string | undefined> => {
  // TODO: Implement
};
