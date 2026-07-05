"use server";

import { revalidatePath } from "next/cache";
import { toActionResult } from "@/lib/api/action_utils";
import type { ActionResult } from "@/lib/api/types";
import type {
  CreateFeeTierPayload,
  FeeTier,
  Rate,
  UpdateFeeTierPayload,
  UpdateRatePayload,
} from "./types";
import * as service from "./service";

export async function fetchRatesAction(): Promise<ActionResult<Rate[]>> {
  return toActionResult(() => service.getRates());
}

export async function fetchTransactionFeesAction(): Promise<
  ActionResult<FeeTier[]>
> {
  return toActionResult(() => service.getTransactionFees());
}

export async function updateRateAction(
  payload: UpdateRatePayload,
): Promise<ActionResult<Rate>> {
  const result = await toActionResult(() => service.updateRate(payload));
  if (result.ok) revalidatePath("/setup");
  return result;
}

export async function createTransactionFeeAction(
  payload: CreateFeeTierPayload,
): Promise<ActionResult<FeeTier>> {
  const result = await toActionResult(() =>
    service.createTransactionFee(payload),
  );
  if (result.ok) revalidatePath("/setup");
  return result;
}

export async function updateTransactionFeeAction(
  feeId: string,
  payload: UpdateFeeTierPayload,
): Promise<ActionResult<FeeTier>> {
  const result = await toActionResult(() =>
    service.updateTransactionFee(feeId, payload),
  );
  if (result.ok) revalidatePath("/setup");
  return result;
}

export async function deleteTransactionFeeAction(
  feeId: string,
): Promise<ActionResult<null>> {
  const result = await toActionResult(() =>
    service.deleteTransactionFee(feeId),
  );
  if (result.ok) revalidatePath("/setup");
  return result;
}
