import type { ChartDataPoint, ChartSeriesPoint, KycLevelCount, VolumeData } from "./types";

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

function getChartPointDate(point: ChartDataPoint): Date {
  if (point.createdAt) {
    return new Date(point.createdAt);
  }

  if (/^[a-f0-9]{24}$/i.test(point._id)) {
    return new Date(parseInt(point._id.slice(0, 8), 16) * 1000);
  }

  return new Date(0);
}

export function formatChartDateLabel(dateKey: string): string {
  const date = new Date(`${dateKey}T00:00:00`);
  const day = date.getDate();
  const month = date.toLocaleString("en-GB", { month: "short" });
  return `${day} ${month}`;
}

export function getChartPointAmount(
  point: ChartDataPoint,
  currency: DashboardCurrency,
): number {
  return currency === "USD" ? point.tokenAmount : point.fiatAmount;
}

export function buildChartPoints(
  chartData: ChartDataPoint[],
  currency: DashboardCurrency,
): ChartSeriesPoint[] {
  if (chartData.length === 0) {
    return [];
  }

  const volumeByDay = new Map<string, number>();

  for (const point of chartData) {
    const dateKey = getChartPointDate(point).toISOString().slice(0, 10);
    const amount = getChartPointAmount(point, currency);
    volumeByDay.set(dateKey, (volumeByDay.get(dateKey) ?? 0) + amount);
  }

  return [...volumeByDay.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([dateKey, volume]) => ({
      dateKey,
      label: formatChartDateLabel(dateKey),
      volume,
    }));
}

export function formatChartAxisLabel(
  value: number,
  currency: DashboardCurrency,
): string {
  return formatCurrencyAmount(value, currency);
}

export function getChartAxisLabels(maxValue: number, steps = 5): number[] {
  if (maxValue <= 0) {
    return [0, 200, 400, 600, 800, 1000];
  }

  const rawInterval = maxValue / steps;
  const magnitude = 10 ** Math.floor(Math.log10(rawInterval));
  const interval = Math.ceil(rawInterval / magnitude) * magnitude;

  return Array.from({ length: steps + 1 }, (_, index) => index * interval);
}
