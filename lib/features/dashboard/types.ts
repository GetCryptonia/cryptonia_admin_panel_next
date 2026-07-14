import type { DateRangeParams } from "@/lib/api/types";

export type VolumeData = {
  currency?: string;
  totalVolume: number;
  totalFiatVolume: number;
  numberOfTransactions: number;
  numberOfUniqueCustomers: number;
};

export type ChartDataPoint = {
  _id: string;
  tokenAmount: number;
  fiatAmount: number;
  type: string;
  createdAt?: string;
};

export type ChartSeriesPoint = {
  dateKey: string;
  label: string;
  volume: number;
};

export type DashboardAnalytics = {
  volumeData: VolumeData[];
  chartData: ChartDataPoint[];
};

export type OrderDistributionItem = {
  symbol?: string;
  totalTokenVolume: number;
  totalFiatVolume: number;
  numberOfTransactions: number;
};

export type KycLevelCount = {
  kycLevel: string | null;
  totalCount: number;
};

export type ReferralCodeUsage = {
  referralCode: string;
  totalUsers: number;
};

export type UserActivityData = {
  totalCustomersCreated: number;
  totalCompletedTransactions: number;
  totalUsersUsedReferralCode: number;
  kycLevels: KycLevelCount[];
  referralCodesUsed: ReferralCodeUsage[];
};

export type DashboardData = {
  analytics: DashboardAnalytics;
  orderDistribution: OrderDistributionItem[];
  userActivity: UserActivityData;
};

export type DashboardDateRange = DateRangeParams;
