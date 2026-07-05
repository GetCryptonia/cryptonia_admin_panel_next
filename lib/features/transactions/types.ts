import type { PaginatedResponse } from "@/lib/api/types";

export enum OrderType {
  BUY = "buy",
  SELL = "sell",
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
  GLOBAL_PAYOUT = "globalPayout",
  TAG_SEND = "tagSend",
  TAG_RECEIVE = "tagReceive",
  CARD_FUNDING = "cardFunding",
  CARD_CHARGE = "cardCharge",
  CARD_WITHDRAWAL = "cardWithdrawal",
  CARD_CREATION = "cardCreation",
}

export enum OrderStatus {
  PROCESSING = "processing",
  RECEIVED = "received",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export type Order = {
  _id: string;
  type?: OrderType | null;
  userId: string;
  symbol: string | null;
  status: OrderStatus;
  tokenAmount: number;
  fiatAmount: number;
  fee?: number | null;
  address: string | null;
  senderId?: string | null;
  senderTag?: string | null;
  senderUsername?: string | null;
  recipientTag?: string | null;
  recipientUsername?: string | null;
  receiverBank: string | null;
  receiverBankCode: string | null;
  receiverSessionId: string | null;
  receiverAccountName: string | null;
  receiverAccountNumber: string | null;
  expiryDate?: string | null;
  fiatSymbol?: string | null;
  orderRefId?: string | null;
  orderInfo: Record<string, unknown> | null;
  paymentInfo: Record<string, unknown> | null;
  paymentRefId?: string | null;
  referralCode: string | null;
  narration?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PaginatedTransactions = PaginatedResponse<
  Order,
  "transactions",
  "totalTransactions"
>;

export type CompleteTransactionPayload = {
  paymentRefId: string;
};

export type RescanTransactionPayload = {
  transactionHash: string;
  symbol: string;
};

export type ReverseTransactionData = {
  order: Order;
  creditedAmount: number;
};

export type RescanTransactionData = {
  message: string;
  statusCode: number;
};
