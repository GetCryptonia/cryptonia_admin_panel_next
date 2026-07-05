export type Rate = {
  _id: string;
  tokenAmount: number;
  fiatAmount: number;
  tokenAmountBuy: number;
  fiatAmountBuy: number;
  currency: string;
  createdAt?: string;
  updatedAt?: string;
};

export type UpdateRatePayload = {
  currency: string;
  rate: number;
  buyRate: number;
};

export type FeeTier = {
  _id: string;
  currencyType: "stablecoin" | "fiat";
  currency: string;
  transactionType: "deposit" | "withdraw";
  minAmount: number;
  maxAmount: number | null;
  fee: number;
  feeType: "fixed" | "percentage";
  createdAt?: string;
  updatedAt?: string;
};

export type CreateFeeTierPayload = {
  currencyType: "stablecoin" | "fiat";
  currency: string;
  transactionType: "deposit" | "withdraw";
  minAmount: number;
  maxAmount: number;
  fee: number;
  feeType: "fixed" | "percentage";
};

export type UpdateFeeTierPayload = CreateFeeTierPayload;
