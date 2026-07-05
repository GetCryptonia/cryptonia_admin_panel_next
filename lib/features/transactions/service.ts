import { apiRequest } from "@/lib/api/client";
import type { PageParams } from "@/lib/api/types";
import type {
  CompleteTransactionPayload,
  Order,
  PaginatedTransactions,
  RescanTransactionData,
  RescanTransactionPayload,
  ReverseTransactionData,
} from "./types";

export async function getTransactions(
  params?: PageParams,
): Promise<PaginatedTransactions> {
  return apiRequest<PaginatedTransactions>("/admin-panel/transactions", {
    query: params,
  });
}

export async function searchTransactions(
  query: string,
  params?: PageParams,
): Promise<PaginatedTransactions> {
  return apiRequest<PaginatedTransactions>(
    "/admin-panel/transactions/search",
    { query: { query, ...params } },
  );
}

export async function completeTransaction(
  transactionId: string,
  payload: CompleteTransactionPayload,
): Promise<Order> {
  return apiRequest<Order>(
    `/admin-panel/transactions/${transactionId}/complete`,
    { method: "PUT", body: payload },
  );
}

export async function reverseTransaction(
  transactionId: string,
): Promise<ReverseTransactionData> {
  return apiRequest<ReverseTransactionData>(
    `/admin-panel/transactions/${transactionId}/reverse`,
    { method: "PUT" },
  );
}

export async function rescanTransaction(
  payload: RescanTransactionPayload,
): Promise<RescanTransactionData> {
  return apiRequest<RescanTransactionData>("/admin-panel/transactions/rescan", {
    method: "POST",
    body: payload,
  });
}
