import { apiRequest } from "@/lib/api/client";
import type { OffsetParams } from "@/lib/api/types";
import type {
  CreateClaimableRewardsPayload,
  CreateVoucherRewardsPayload,
  Reward,
  RewardsData,
} from "./types";

export async function getRewards(params?: OffsetParams): Promise<RewardsData> {
  return apiRequest<RewardsData>("/admin-panel/rewards", { query: params });
}

export async function createClaimableRewards(
  payload: CreateClaimableRewardsPayload,
): Promise<Reward[]> {
  return apiRequest<Reward[]>("/admin-panel/rewards/claimable", {
    method: "POST",
    body: payload,
  });
}

export async function createVoucherRewards(
  payload: CreateVoucherRewardsPayload,
): Promise<Reward[]> {
  return apiRequest<Reward[]>("/admin-panel/rewards/voucher", {
    method: "POST",
    body: payload,
  });
}

export async function deleteReward(rewardId: string): Promise<null> {
  return apiRequest<null>(`/admin-panel/rewards/${rewardId}`, {
    method: "DELETE",
  });
}
