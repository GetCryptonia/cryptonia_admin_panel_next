export enum RewardStatus {
  PENDING = "PENDING",
  ASSIGNED = "ASSIGNED",
  CLAIMED = "CLAIMED",
  EXPIRED = "EXPIRED",
}

export enum RewardType {
  CASHBACK = "CASHBACK",
  DATA_SUBSCRIPTION = "DATA_SUBSCRIPTION",
  AIRTIME_RECHARGE = "AIRTIME_RECHARGE",
  CHOWDECK_VOUCHER = "CHOWDECK_VOUCHER",
  MOVIE_TICKET = "MOVIE_TICKET",
  SHOWMAX_VOUCHER = "SHOWMAX_VOUCHER",
  TRY_AGAIN = "TRY_AGAIN",
  BLANK = "BLANK",
}

export type Reward = {
  _id: string;
  type: RewardType;
  status: RewardStatus;
  userId: string | null;
  amount: number | null;
  voucherCode: string | null;
  voucherIv: string | null;
  bankAccountId: string | null;
  sessionId: string | null;
  payoutInfo: Record<string, unknown> | null;
  name: string | null;
  expiryDate: string | null;
  serviceCategoryId: string | null;
  bundleCode: string | null;
  phoneNumber: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type RewardStatusCounts = Partial<Record<RewardStatus, number>> & {
  total?: number;
};

export type RewardsData = {
  rewards: Reward[];
  statuses: RewardStatusCounts;
};

export type CreateClaimableRewardsPayload = {
  claimableAmount: number;
  amount: number;
  type: RewardType;
};

export type CreateVoucherRewardsPayload = {
  type: RewardType;
  voucherCodes: string[];
};
