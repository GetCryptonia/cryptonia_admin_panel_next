"use server";

import { toActionResult } from "@/lib/api/action_utils";
import type { ActionResult } from "@/lib/api/types";
import type { BalancesData } from "./types";
import * as service from "./service";

export async function fetchBalancesAction(): Promise<ActionResult<BalancesData>> {
  return toActionResult(() => service.getBalances());
}
