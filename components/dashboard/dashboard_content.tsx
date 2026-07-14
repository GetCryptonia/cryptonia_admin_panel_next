"use client";

import CurrencySwitcher from "@/components/dashboard/currency_switcher";
import DashboardTopBar from "@/components/dashboard/dashboard_top_bar";
import MetricCard from "@/components/dashboard/metric_card";
import TodayMetricsPanel from "@/components/dashboard/today_metrics_panel";
import VolumeChart from "@/components/dashboard/volume_chart";
import { redirectIfUnauthorized } from "@/lib/api/client_action_utils";
import { fetchDashboardDataAction } from "@/lib/features/dashboard/actions";
import { getDefaultDateRange } from "@/lib/features/dashboard/date_range";
import type { DashboardData } from "@/lib/features/dashboard/types";
import {
  formatCurrencyAmount,
  getCompletedKycCount,
  getOrderDistributionAmount,
  getVolumeAmount,
  selectVolumeData,
  type DashboardCurrency,
} from "@/lib/features/dashboard/utils";
import type { DateRangeParams } from "@/lib/api/types";
import {
  Chart,
  MoneyRecive,
  People,
  SecuritySafe,
  UserAdd,
  Verify,
} from "iconsax-reactjs";
import { useCallback, useMemo, useState, useTransition } from "react";

type MetricTab = "users" | "transactions";

type DashboardContentProps = {
  initialData: DashboardData;
};

export default function DashboardContent({
  initialData,
}: DashboardContentProps) {
  const defaultRange = getDefaultDateRange();
  const [currency, setCurrency] = useState<DashboardCurrency>("USD");
  const [metricTab, setMetricTab] = useState<MetricTab>("users");
  const [startDate, setStartDate] = useState(defaultRange.startDate);
  const [endDate, setEndDate] = useState(defaultRange.endDate);
  const [dashboardData, setDashboardData] = useState(initialData);
  const [error, setError] = useState<string | null>(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const loadDashboardData = useCallback((range: DateRangeParams) => {
    startTransition(async () => {
      const result = await fetchDashboardDataAction(range);

      if (redirectIfUnauthorized(result)) {
        return;
      }

      if (!result.ok) {
        setError(result.message);
        return;
      }

      setError(null);
      setStartDate(range.startDate);
      setEndDate(range.endDate);
      setDashboardData(result.data);
    });
  }, []);

  const handleOpenDatePicker = () => {
    setIsDatePickerOpen(true);
  };

  const handleCloseDatePicker = () => {
    setIsDatePickerOpen(false);
  };

  const handleApplyDateRange = (range: DateRangeParams) => {
    loadDashboardData(range);
  };

  const volumeData = useMemo(
    () => selectVolumeData(dashboardData?.analytics.volumeData),
    [dashboardData?.analytics.volumeData],
  );

  const chartData = dashboardData?.analytics.chartData ?? [];
  const userActivity = dashboardData?.userActivity ?? null;
  const orderDistribution = useMemo(() => {
    const items = dashboardData?.orderDistribution ?? [];
    return [...items].sort(
      (a, b) =>
        getOrderDistributionAmount(b, currency) -
        getOrderDistributionAmount(a, currency),
    );
  }, [dashboardData?.orderDistribution, currency]);

  const totalDistributionVolume =
    orderDistribution.reduce(
      (sum, item) => sum + getOrderDistributionAmount(item, currency),
      0,
    );
  const totalDistributionTransactions =
    orderDistribution.reduce(
      (sum, item) => sum + item.numberOfTransactions,
      0,
    );

  return (
    <div className="flex flex-col">
      <DashboardTopBar
        title="Dashboard"
        startDate={startDate}
        endDate={endDate}
        isDatePickerOpen={isDatePickerOpen}
        onOpenDatePicker={handleOpenDatePicker}
        onCloseDatePicker={handleCloseDatePicker}
        onApplyDateRange={handleApplyDateRange}
      />

      <div className="flex flex-col gap-[24px] p-[24px] md:p-[48px]">
        <CurrencySwitcher currency={currency} onChange={setCurrency} />

        {error && (
          <div className="rounded-[12px] border border-primary/30 bg-primary/5 px-[16px] py-[12px] text-sm text-primary">
            {error}
          </div>
        )}

        <div
          className={`grid grid-cols-1 gap-[20px] xl:grid-cols-[1.6fr_1fr] ${isPending ? "opacity-60" : ""
            }`}
        >
          <VolumeChart
            title={`${currency} Transaction Volume`}
            chartData={chartData}
            currency={currency}
          />
          <TodayMetricsPanel volumeData={volumeData} currency={currency} />
        </div>

        <div className="flex flex-row flex-wrap gap-[12px]">
          {(
            [
              { key: "users", label: "Users Metric" },
              { key: "transactions", label: "Transactions Metric" },
            ] as const
          ).map((tab) => {
            const isActive = metricTab === tab.key;

            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setMetricTab(tab.key)}
                className={`rounded-full border px-[18px] py-[8px] text-xs font-semibold uppercase tracking-wide transition-colors ${isActive
                  ? "border-primary text-text-color"
                  : "border-divider-color text-hint-text-color"
                  }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {metricTab === "users" ? (
          <div className="grid grid-cols-1 gap-[20px] md:grid-cols-3">
            <MetricCard
              label="Total Users"
              value={userActivity?.totalCustomersCreated ?? 0}
              icon={People}
              iconVariant="Bulk"
              iconBgClassName="bg-[#ECE8FF]"
              iconColor="#7B61FF"
              href="/customers"
            />
            <MetricCard
              label="New Users"
              value={volumeData?.numberOfUniqueCustomers ?? 0}
              icon={UserAdd}
              iconVariant="Bulk"
              iconBgClassName="bg-primary/10"
              iconColor="var(--primary)"
              href="/customers"
            />
            <MetricCard
              label="Completed KYC"
              value={getCompletedKycCount(userActivity?.kycLevels ?? [])}
              icon={Verify}
              iconVariant="Bulk"
              iconBgClassName="bg-success-color/10"
              iconColor="var(--success-color)"
              href="/customers"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-[20px] md:grid-cols-3">
            <MetricCard
              label="Completed Transactions"
              value={userActivity?.totalCompletedTransactions ?? 0}
              icon={MoneyRecive}
              iconVariant="Bulk"
              iconBgClassName="bg-primary/10"
              iconColor="var(--primary)"
              href="/transactions"
            />
            <MetricCard
              label="Total Volume"
              value={formatCurrencyAmount(
                volumeData
                  ? getVolumeAmount(volumeData, currency)
                  : totalDistributionVolume,
                currency,
              )}
              icon={Chart}
              iconVariant="Bulk"
              iconBgClassName="bg-[#ECE8FF]"
              iconColor="#7B61FF"
              href="/transactions"
            />
            <MetricCard
              label="Referred Users"
              value={userActivity?.totalUsersUsedReferralCode ?? 0}
              icon={SecuritySafe}
              iconVariant="Bulk"
              iconBgClassName="bg-success-color/10"
              iconColor="var(--success-color)"
              href="/transactions"
            />
          </div>
        )}

        {metricTab === "transactions" &&
          orderDistribution.length > 0 && (
            <div className="rounded-[16px] border border-divider-color bg-background p-[24px]">
              <div className="mb-[16px] flex flex-row items-center justify-between gap-[12px]">
                <h3 className="text-base font-semibold">Order Distribution</h3>
                <p className="text-sm text-hint-text-color">
                  {totalDistributionTransactions.toLocaleString()} transactions
                  across {orderDistribution.length.toLocaleString()} token types
                </p>
              </div>

              <div className="grid grid-cols-1 gap-[12px] md:grid-cols-2 xl:grid-cols-3">
                {orderDistribution.map((item, index) => (
                  <div
                    key={`${item.symbol ?? "token"}-${index}`}
                    className="rounded-[12px] bg-divider-color/60 px-[16px] py-[14px]"
                  >
                    <p className="text-sm font-semibold">
                      {item.symbol ?? `Token ${index + 1}`}
                    </p>
                    <p className="mt-[4px] text-xs text-hint-text-color">
                      {item.numberOfTransactions.toLocaleString()} transactions
                    </p>
                    <p className="mt-[8px] text-sm font-medium">
                      {formatCurrencyAmount(
                        getOrderDistributionAmount(item, currency),
                        currency,
                      )}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
