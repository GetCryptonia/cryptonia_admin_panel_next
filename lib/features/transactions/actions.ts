"use server";

import { revalidatePath } from "next/cache";
import { toActionResult } from "@/lib/api/action_utils";
import type { ActionResult, PageParams } from "@/lib/api/types";
import type {
  CompleteTransactionPayload,
  Order,
  PaginatedTransactions,
  RescanTransactionData,
  RescanTransactionPayload,
  ReverseTransactionData,
} from "./types";
import * as service from "./service";

export async function fetchTransactionsAction(
  params?: PageParams,
): Promise<ActionResult<PaginatedTransactions>> {
  return toActionResult(() => service.getTransactions(params));
}

export async function searchTransactionsAction(
  query: string,
  params?: PageParams,
): Promise<ActionResult<PaginatedTransactions>> {
  return toActionResult(() => service.searchTransactions(query, params));
}

export async function completeTransactionAction(
  transactionId: string,
  payload: CompleteTransactionPayload,
): Promise<ActionResult<Order>> {
  const result = await toActionResult(() =>
    service.completeTransaction(transactionId, payload),
  );
  if (result.ok) revalidatePath("/transactions");
  return result;
}

export async function reverseTransactionAction(
  transactionId: string,
): Promise<ActionResult<ReverseTransactionData>> {
  const result = await toActionResult(() =>
    service.reverseTransaction(transactionId),
  );
  if (result.ok) revalidatePath("/transactions");
  return result;
}

export async function rescanTransactionAction(
  payload: RescanTransactionPayload,
): Promise<ActionResult<RescanTransactionData>> {
  const result = await toActionResult(() =>
    service.rescanTransaction(payload),
  );
  if (result.ok) revalidatePath("/transactions");
  return result;
}
