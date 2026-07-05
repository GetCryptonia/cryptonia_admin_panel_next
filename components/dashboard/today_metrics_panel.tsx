"use client";

import {
  formatCount,
  formatCurrencyAmount,
  type DashboardCurrency,
} from "@/lib/features/dashboard/utils";
import type { VolumeData } from "@/lib/features/dashboard/types";
import { Chart2, MoneyTime, People } from "iconsax-reactjs";

type TodayMetricsPanelProps = {
  volumeData: VolumeData | null;
  currency: DashboardCurrency;
};

export default function TodayMetricsPanel({
  volumeData,
  currency,
}: TodayMetricsPanelProps) {
  const metrics = [
    {
      label: "Total Volume Traded",
      value: volumeData
        ? formatCurrencyAmount(volumeData.totalVolume, currency)
        : formatCurrencyAmount(0, currency),
      icon: Chart2,
    },
    {
      label: "No Transactions",
      value: volumeData
        ? formatCount(volumeData.numberOfTransactions, "Transactions")
        : formatCount(0, "Transactions"),
      icon: MoneyTime,
    },
    {
      label: "New Users",
      value: volumeData
        ? formatCount(volumeData.numberOfUniqueCustomers, "Users")
        : formatCount(0, "Users"),
      icon: People,
    },
  ];

  return (
    <div className="flex h-full min-h-[320px] flex-col rounded-[16px] border border-divider-color bg-background p-[24px]">
      <h3 className="text-base font-semibold">Today&apos;s Metric</h3>

      <div className="mt-[24px] flex flex-1 flex-col justify-center gap-[28px]">
        {metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <div key={metric.label} className="flex flex-row items-center gap-[16px]">
              <div className="flex h-[48px] w-[48px] items-center justify-center rounded-full border border-divider-color">
                <Icon size={22} color="var(--text-color)" variant="Linear" />
              </div>
              <div className="flex flex-col gap-[4px]">
                <p className="text-sm text-hint-text-color">{metric.label}</p>
                <p className="text-xl font-semibold">{metric.value}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
