import { apiRequest } from "@/lib/api/client";
import type { DateRangeParams } from "@/lib/api/types";
import type {
  DashboardAnalytics,
  DashboardData,
  OrderDistributionItem,
  UserActivityData,
} from "./types";

export async function getDashboardAnalytics(
  params: DateRangeParams,
): Promise<DashboardAnalytics> {
  return apiRequest<DashboardAnalytics>("/admin-panel/dashboard", {
    query: params,
  });
}

export async function getOrderDistribution(
  params: DateRangeParams,
): Promise<OrderDistributionItem[]> {
  return apiRequest<OrderDistributionItem[]>("/admin-panel/order-distribution", {
    query: params,
  });
}

export async function getUserActivity(
  params: DateRangeParams,
): Promise<UserActivityData> {
  return apiRequest<UserActivityData>("/admin-panel/user-activity", {
    query: params,
  });
}

export async function getDashboardData(
  params: DateRangeParams,
): Promise<DashboardData> {
  const [analytics, orderDistribution, userActivity] = await Promise.all([
    getDashboardAnalytics(params),
    getOrderDistribution(params),
    getUserActivity(params),
  ]);

  return {
    analytics,
    orderDistribution,
    userActivity,
  };
}
