import { apiRequest } from "@/lib/api/client";
import type {
  CreateFeeTierPayload,
  FeeTier,
  Rate,
  UpdateFeeTierPayload,
  UpdateRatePayload,
} from "./types";

export async function getRates(): Promise<Rate[]> {
  return apiRequest<Rate[]>("/admin-panel/setup/rates");
}

export async function updateRate(payload: UpdateRatePayload): Promise<Rate> {
  return apiRequest<Rate>("/admin-panel/setup/rates", {
    method: "PUT",
    body: payload,
  });
}

export async function getTransactionFees(): Promise<FeeTier[]> {
  return apiRequest<FeeTier[]>("/admin-panel/setup/transaction-fees");
}

export async function createTransactionFee(
  payload: CreateFeeTierPayload,
): Promise<FeeTier> {
  return apiRequest<FeeTier>("/admin-panel/setup/transaction-fees", {
    method: "POST",
    body: payload,
  });
}

export async function updateTransactionFee(
  feeId: string,
  payload: UpdateFeeTierPayload,
): Promise<FeeTier> {
  return apiRequest<FeeTier>(`/admin-panel/setup/transaction-fees/${feeId}`, {
    method: "PUT",
    body: payload,
  });
}

export async function deleteTransactionFee(feeId: string): Promise<null> {
  return apiRequest<null>(`/admin-panel/setup/transaction-fees/${feeId}`, {
    method: "DELETE",
  });
}
