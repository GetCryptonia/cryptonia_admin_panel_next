import {
  FIAT_CURRENCY_CODES,
  formatFiatBalance,
  getFiatFlagBackground,
  getFiatFlagPath,
  type FiatCurrencyCode,
} from "@/lib/features/balances/utils";
import type { FeeTier, Rate } from "./types";

export { FIAT_CURRENCY_CODES, getFiatFlagBackground, getFiatFlagPath };
export type { FiatCurrencyCode };

export type RateFormValues = {
  withdrawalRate: number;
  depositRate: number;
};

export function mapRatesByCurrency(
  rates: Rate[],
): Record<FiatCurrencyCode, Rate | null> {
  const mapped = Object.fromEntries(
    FIAT_CURRENCY_CODES.map((currency) => [currency, null]),
  ) as Record<FiatCurrencyCode, Rate | null>;

  for (const rate of rates) {
    const currency = rate.currency.toUpperCase();

    if (currency in mapped) {
      mapped[currency as FiatCurrencyCode] = rate;
    }
  }

  return mapped;
}

export function getRateFormValues(rate: Rate | null): RateFormValues {
  return {
    withdrawalRate: rate?.fiatAmount ?? 0,
    depositRate: rate?.fiatAmountBuy ?? 0,
  };
}

export function formatRateInput(
  value: number,
  currency: FiatCurrencyCode,
): string {
  return formatFiatBalance(value, currency);
}

export function parseRateInput(value: string): number {
  const normalized = value.replace(/[^\d.-]/g, "");
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function formatCurrencyTypeLabel(
  currencyType: FeeTier["currencyType"],
): string {
  return currencyType === "stablecoin" ? "Stablecoin" : "Fiat";
}

export function formatTransactionTypeLabel(
  transactionType: FeeTier["transactionType"],
): string {
  return transactionType === "deposit" ? "Deposit" : "Withdraw";
}

export function formatFeeTypeLabel(feeType: FeeTier["feeType"]): string {
  return feeType === "fixed" ? "Fixed" : "Percentage";
}

export function formatFeeAmount(fee: FeeTier): string {
  if (fee.feeType === "percentage") {
    return `${fee.fee}%`;
  }

  return fee.fee.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatAmountRange(
  minAmount: number,
  maxAmount: number | null,
): string {
  const min = minAmount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  if (maxAmount === null) {
    return `${min}+`;
  }

  const max = maxAmount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return `${min} – ${max}`;
}

export function sortFeeTiers(fees: FeeTier[]): FeeTier[] {
  return [...fees].sort((a, b) => {
    const typeCompare = a.currencyType.localeCompare(b.currencyType);
    if (typeCompare !== 0) return typeCompare;

    const currencyCompare = a.currency.localeCompare(b.currency);
    if (currencyCompare !== 0) return currencyCompare;

    return a.transactionType.localeCompare(b.transactionType);
  });
}

export function areRateValuesDirty(
  current: RateFormValues,
  saved: RateFormValues,
): boolean {
  return (
    current.withdrawalRate !== saved.withdrawalRate ||
    current.depositRate !== saved.depositRate
  );
}

export function isValidRateValues(values: RateFormValues): boolean {
  return values.withdrawalRate > 0 && values.depositRate > 0;
}
