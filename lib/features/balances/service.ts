import { apiRequest } from "@/lib/api/client";
import type { BalancesData } from "./types";

export async function getBalances(): Promise<BalancesData> {
  return apiRequest<BalancesData>("/admin-panel/balances");
}
