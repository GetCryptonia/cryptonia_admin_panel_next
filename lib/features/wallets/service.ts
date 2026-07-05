import { apiRequest } from "@/lib/api/client";
import type { PageParams } from "@/lib/api/types";
import type { PaginatedWallets, WalletDetails } from "./types";

export async function getWallets(
  params?: PageParams,
): Promise<PaginatedWallets> {
  return apiRequest<PaginatedWallets>("/admin-panel/wallets", { query: params });
}

export async function searchWallets(
  query: string,
  params?: PageParams,
): Promise<PaginatedWallets> {
  return apiRequest<PaginatedWallets>("/admin-panel/wallets/search", {
    query: { query, ...params },
  });
}

export async function getWalletDetails(
  walletId: string,
): Promise<WalletDetails> {
  return apiRequest<WalletDetails>(`/admin-panel/wallets/${walletId}`);
}
