"use client";

import RateCard from "@/components/setup/rate_card";
import type { Rate } from "@/lib/features/setup/types";
import {
  FIAT_CURRENCY_CODES,
  mapRatesByCurrency,
  type FiatCurrencyCode,
} from "@/lib/features/setup/utils";
import { useMemo, useState } from "react";

type RatesSectionProps = {
  rates: Rate[];
  onError: (message: string) => void;
  disabled?: boolean;
};

export default function RatesSection({
  rates,
  onError,
  disabled = false,
}: RatesSectionProps) {
  const [localRates, setLocalRates] = useState(rates);

  const ratesByCurrency = useMemo(
    () => mapRatesByCurrency(localRates),
    [localRates],
  );

  const handleSaved = (updatedRate: Rate) => {
    setLocalRates((current) => {
      const currency = updatedRate.currency.toUpperCase() as FiatCurrencyCode;
      const existingIndex = current.findIndex(
        (rate) => rate.currency.toUpperCase() === currency,
      );

      if (existingIndex === -1) {
        return [...current, updatedRate];
      }

      return current.map((rate, index) =>
        index === existingIndex ? updatedRate : rate,
      );
    });
  };

  return (
    <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2">
      {FIAT_CURRENCY_CODES.map((currency) => (
        <RateCard
          key={currency}
          currency={currency}
          rate={ratesByCurrency[currency]}
          onSaved={handleSaved}
          onError={onError}
          disabled={disabled}
        />
      ))}
    </div>
  );
}
