import type { ChartDataPoint, KycLevelCount, VolumeData } from "./types";

export type DashboardCurrency = "USD" | "NGN";

const COMPLETED_KYC_LEVELS = new Set(["BVN", "NIN", "ADDRESS"]);

export function selectVolumeData(
  volumeData: VolumeData[] | undefined,
  currency: DashboardCurrency,
): VolumeData | null {
  if (!volumeData?.length) {
    return null;
  }

  const matched = volumeData.find(
    (entry) => entry.currency?.toUpperCase() === currency,
  );
  if (matched) {
    return matched;
  }

  if (volumeData.length === 1) {
    return volumeData[0];
  }

  const index = currency === "USD" ? 0 : 1;
  return volumeData[index] ?? volumeData[0] ?? null;
}

export function formatCurrencyAmount(
  amount: number,
  currency: DashboardCurrency,
): string {
  const symbol = currency === "USD" ? "$" : "₦";

  if (amount >= 1_000_000) {
    return `${symbol}${(amount / 1_000_000).toFixed(2)}M`;
  }

  if (amount >= 1_000) {
    return `${symbol}${amount.toLocaleString(undefined, {
      maximumFractionDigits: 0,
    })}`;
  }

  return `${symbol}${amount.toLocaleString(undefined, {
    maximumFractionDigits: 2,
  })}`;
}

export function formatCount(value: number, suffix: string): string {
  return `${value.toLocaleString()} ${suffix}`;
}

export function getCompletedKycCount(kycLevels: KycLevelCount[]): number {
  return kycLevels
    .filter(
      (level) => level.kycLevel && COMPLETED_KYC_LEVELS.has(level.kycLevel),
    )
    .reduce((sum, level) => sum + level.totalCount, 0);
}

export function buildChartSeries(
  chartData: ChartDataPoint[],
  bucketCount = 10,
): number[] {
  if (chartData.length === 0) {
    return Array.from({ length: bucketCount }, () => 0);
  }

  const cumulative: number[] = [];
  let runningTotal = 0;

  for (const point of chartData) {
    runningTotal += point.fiatAmount;
    cumulative.push(runningTotal);
  }

  if (cumulative.length <= bucketCount) {
    return cumulative;
  }

  const step = cumulative.length / bucketCount;
  return Array.from({ length: bucketCount }, (_, index) => {
    const dataIndex = Math.min(
      Math.round((index + 1) * step) - 1,
      cumulative.length - 1,
    );
    return cumulative[dataIndex] ?? 0;
  });
}

export function getChartAxisLabels(maxValue: number, steps = 5): number[] {
  if (maxValue <= 0) {
    return [0, 200, 400, 600, 800, 1000];
  }

  const interval = Math.ceil(maxValue / steps / 100) * 100 || 100;
  return Array.from({ length: steps + 1 }, (_, index) => index * interval);
}
