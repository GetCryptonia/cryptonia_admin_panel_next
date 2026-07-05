"use client";

import BlockRadarSection from "@/components/balance/block_radar_section";
import FiatBalanceCard from "@/components/balance/fiat_balance_card";
import {
  FIAT_CURRENCY_CODES,
  getBalanceViewModel,
} from "@/lib/features/balances/utils";
import type { BalancesData } from "@/lib/features/balances/types";

type BalanceContentProps = {
  initialData: BalancesData;
};

export default function BalanceContent({ initialData }: BalanceContentProps) {
  const { fiatBalances, cryptoBalances, stablecoinTotal } =
    getBalanceViewModel(initialData);

  return (
    <div className="flex flex-col">
      <div className="hidden border-b border-divider-color px-[24px] py-[20px] md:block md:px-[48px] md:py-[24px]">
        <h1 className="text-[28px] font-semibold">Balance</h1>
      </div>

      <div className="flex flex-col gap-[32px] p-[24px] md:p-[48px]">
        <section className="grid grid-cols-1 gap-[20px] md:grid-cols-2 xl:grid-cols-4">
          {FIAT_CURRENCY_CODES.map((currency) => (
            <FiatBalanceCard
              key={currency}
              currency={currency}
              balance={fiatBalances[currency]}
            />
          ))}
        </section>

        <BlockRadarSection
          stablecoinTotal={stablecoinTotal}
          cryptoBalances={cryptoBalances}
        />
      </div>
    </div>
  );
}
