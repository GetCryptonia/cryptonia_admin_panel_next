"use server";

import { toActionResult } from "@/lib/api/action_utils";
import type { ActionResult, DateRangeParams } from "@/lib/api/types";
import type {
  DashboardAnalytics,
  DashboardData,
  OrderDistributionItem,
  UserActivityData,
} from "./types";
import * as service from "./service";

export async function fetchDashboardAction(
  params: DateRangeParams,
): Promise<ActionResult<DashboardAnalytics>> {
  return toActionResult(() => service.getDashboardAnalytics(params));
}

export async function fetchOrderDistributionAction(
  params: DateRangeParams,
): Promise<ActionResult<OrderDistributionItem[]>> {
  return toActionResult(() => service.getOrderDistribution(params));
}

export async function fetchUserActivityAction(
  params: DateRangeParams,
): Promise<ActionResult<UserActivityData>> {
  return toActionResult(() => service.getUserActivity(params));
}

export async function fetchDashboardDataAction(
  params: DateRangeParams,
): Promise<ActionResult<DashboardData>> {
  return toActionResult(() => service.getDashboardData(params));
}
