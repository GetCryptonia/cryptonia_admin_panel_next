"use client";

import FeesSection from "@/components/setup/fees_section";
import RatesSection from "@/components/setup/rates_section";
import TransactionLimitsSection from "@/components/setup/transaction_limits_section";
import type { FeeTier, Rate } from "@/lib/features/setup/types";
import { useState } from "react";

type SetupTab = "rates" | "transaction-limit" | "fees";

type SetupContentProps = {
  initialRates: Rate[];
  initialFees: FeeTier[];
};

const SETUP_TABS: { key: SetupTab; label: string }[] = [
  { key: "rates", label: "Rates" },
  { key: "transaction-limit", label: "Transaction Limit" },
  { key: "fees", label: "Fees" },
];

export default function SetupContent({
  initialRates,
  initialFees,
}: SetupContentProps) {
  const [activeTab, setActiveTab] = useState<SetupTab>("rates");
  const [error, setError] = useState<string | null>(null);

  const handleError = (message: string) => {
    setError(message);
  };

  const handleTabChange = (tab: SetupTab) => {
    setActiveTab(tab);
    setError(null);
  };

  return (
    <div className="flex flex-col">
      <div className="hidden border-b border-divider-color px-[24px] py-[20px] md:block md:px-[48px] md:py-[24px]">
        <h1 className="text-[28px] font-semibold">Setup</h1>
      </div>

      <div className="flex flex-col gap-[24px] p-[24px] md:p-[48px]">
        <div className="flex flex-row flex-wrap gap-[12px]">
          {SETUP_TABS.map((tab) => {
            const isActive = activeTab === tab.key;

            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => handleTabChange(tab.key)}
                className={`rounded-[10px] border px-[18px] py-[8px] text-xs font-semibold uppercase tracking-wide transition-colors ${
                  isActive
                    ? "border-primary text-text-color"
                    : "border-divider-color text-hint-text-color"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {error ? (
          <div className="rounded-[12px] border border-primary/30 bg-primary/5 px-[16px] py-[12px] text-sm text-primary">
            {error}
          </div>
        ) : null}

        {activeTab === "rates" ? (
          <RatesSection rates={initialRates} onError={handleError} />
        ) : null}

        {activeTab === "transaction-limit" ? (
          <TransactionLimitsSection />
        ) : null}

        {activeTab === "fees" ? (
          <FeesSection fees={initialFees} onError={handleError} />
        ) : null}
      </div>
    </div>
  );
}
