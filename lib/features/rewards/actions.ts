"use server";

import { revalidatePath } from "next/cache";
import { toActionResult } from "@/lib/api/action_utils";
import type { ActionResult, OffsetParams } from "@/lib/api/types";
import type {
  CreateClaimableRewardsPayload,
  CreateVoucherRewardsPayload,
  Reward,
  RewardsData,
} from "./types";
import * as service from "./service";

export async function fetchRewardsAction(
  params?: OffsetParams,
): Promise<ActionResult<RewardsData>> {
  return toActionResult(() => service.getRewards(params));
}

export async function createClaimableRewardsAction(
  payload: CreateClaimableRewardsPayload,
): Promise<ActionResult<Reward[]>> {
  const result = await toActionResult(() =>
    service.createClaimableRewards(payload),
  );
  if (result.ok) revalidatePath("/rewards");
  return result;
}

export async function createVoucherRewardsAction(
  payload: CreateVoucherRewardsPayload,
): Promise<ActionResult<Reward[]>> {
  const result = await toActionResult(() =>
    service.createVoucherRewards(payload),
  );
  if (result.ok) revalidatePath("/rewards");
  return result;
}

export async function deleteRewardAction(
  rewardId: string,
): Promise<ActionResult<null>> {
  const result = await toActionResult(() => service.deleteReward(rewardId));
  if (result.ok) revalidatePath("/rewards");
  return result;
}
