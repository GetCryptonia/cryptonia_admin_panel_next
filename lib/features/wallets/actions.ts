"use server";

import { toActionResult } from "@/lib/api/action_utils";
import type { ActionResult, PageParams } from "@/lib/api/types";
import type { PaginatedWallets, WalletDetails } from "./types";
import * as service from "./service";

export async function fetchWalletsAction(
  params?: PageParams,
): Promise<ActionResult<PaginatedWallets>> {
  return toActionResult(() => service.getWallets(params));
}

export async function searchWalletsAction(
  query: string,
  params?: PageParams,
): Promise<ActionResult<PaginatedWallets>> {
  return toActionResult(() => service.searchWallets(query, params));
}

export async function fetchWalletDetailsAction(
  walletId: string,
): Promise<ActionResult<WalletDetails>> {
  return toActionResult(() => service.getWalletDetails(walletId));
}
