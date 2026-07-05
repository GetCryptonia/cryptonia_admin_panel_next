"use client";

import CryptoBalanceCard from "@/components/balance/crypto_balance_card";
import StablecoinBanner from "@/components/balance/stablecoin_banner";
import {
  filterCryptoBalances,
  type ParsedCryptoBalance,
  type StablecoinFilter,
} from "@/lib/features/balances/utils";
import { useMemo, useState } from "react";

type BlockRadarSectionProps = {
  stablecoinTotal: number;
  cryptoBalances: ParsedCryptoBalance[];
};

const FILTER_TABS: { key: StablecoinFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "usdt", label: "USDT Balances" },
  { key: "usdc", label: "USDC Balances" },
];

export default function BlockRadarSection({
  stablecoinTotal,
  cryptoBalances,
}: BlockRadarSectionProps) {
  const [filter, setFilter] = useState<StablecoinFilter>("all");

  const filteredBalances = useMemo(
    () => filterCryptoBalances(cryptoBalances, filter),
    [cryptoBalances, filter],
  );

  return (
    <section className="flex flex-col gap-[20px]">
      <h2 className="text-[20px] font-semibold">Block Radar</h2>

      <StablecoinBanner total={stablecoinTotal} />

      <div className="flex flex-row flex-wrap gap-[12px]">
        {FILTER_TABS.map((tab) => {
          const isActive = filter === tab.key;

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setFilter(tab.key)}
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

      <div className="rounded-[16px] border border-divider-color bg-background p-[20px] shadow-[0_8px_24px_rgba(12,12,12,0.04)] md:p-[24px]">
        {filteredBalances.length > 0 ? (
          <div className="grid grid-cols-1 gap-[16px] sm:grid-cols-2 xl:grid-cols-4">
            {filteredBalances.map((balance) => (
              <CryptoBalanceCard
                key={`${balance.token}-${balance.network}`}
                balance={balance}
              />
            ))}
          </div>
        ) : (
          <p className="py-[32px] text-center text-sm text-hint-text-color">
            No stablecoin balances found for this filter.
          </p>
        )}
      </div>
    </section>
  );
}
