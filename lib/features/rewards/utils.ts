import { RewardStatus, RewardType } from "./types";
import type { Reward } from "./types";

const REWARD_TYPE_LABELS: Record<RewardType, string> = {
  [RewardType.CASHBACK]: "Cashback",
  [RewardType.DATA_SUBSCRIPTION]: "Data Subscription",
  [RewardType.AIRTIME_RECHARGE]: "Airtime Recharge",
  [RewardType.CHOWDECK_VOUCHER]: "Chowdeck Voucher",
  [RewardType.MOVIE_TICKET]: "Movie Ticket",
  [RewardType.SHOWMAX_VOUCHER]: "Showmax Voucher",
  [RewardType.TRY_AGAIN]: "Try Again",
  [RewardType.BLANK]: "Blank",
};

const REWARD_STATUS_LABELS: Record<RewardStatus, string> = {
  [RewardStatus.PENDING]: "Pending",
  [RewardStatus.ASSIGNED]: "Assigned",
  [RewardStatus.CLAIMED]: "Claimed",
  [RewardStatus.EXPIRED]: "Expired",
};

export const REWARD_TYPE_OPTIONS = Object.values(RewardType).map((type) => ({
  value: type,
  label: REWARD_TYPE_LABELS[type],
}));

export const REWARD_STATUS_OPTIONS = Object.values(RewardStatus).map(
  (status) => ({
    value: status,
    label: REWARD_STATUS_LABELS[status],
  }),
);

export const VOUCHER_REWARD_TYPES = [
  RewardType.CHOWDECK_VOUCHER,
  RewardType.SHOWMAX_VOUCHER,
  RewardType.MOVIE_TICKET,
];

export const CLAIMABLE_REWARD_TYPES = [
  RewardType.CASHBACK,
  RewardType.DATA_SUBSCRIPTION,
  RewardType.AIRTIME_RECHARGE,
  RewardType.TRY_AGAIN,
  RewardType.BLANK,
];

export function formatRewardType(type: RewardType): string {
  return REWARD_TYPE_LABELS[type] ?? type;
}

export function formatRewardStatus(status: RewardStatus): string {
  return REWARD_STATUS_LABELS[status] ?? status;
}

export function getRewardStatusClass(status: RewardStatus): string {
  switch (status) {
    case RewardStatus.CLAIMED:
      return "bg-success-color/10 text-success-color";
    case RewardStatus.ASSIGNED:
      return "bg-secondary/10 text-secondary";
    case RewardStatus.PENDING:
      return "bg-primary/10 text-primary";
    case RewardStatus.EXPIRED:
    default:
      return "bg-hint-text-color/10 text-hint-text-color";
  }
}

export function filterRewards(
  rewards: Reward[],
  typeFilter: RewardType | "all",
  statusFilter: RewardStatus | "all",
): Reward[] {
  return rewards.filter((reward) => {
    const matchesType = typeFilter === "all" || reward.type === typeFilter;
    const matchesStatus =
      statusFilter === "all" || reward.status === statusFilter;
    return matchesType && matchesStatus;
  });
}
