import Image from "next/image";
import {
  formatFiatBalance,
  getFiatBalanceLabel,
  getFiatFlagBackground,
  getFiatFlagPath,
  parseBalanceValue,
  type FiatCurrencyCode,
} from "@/lib/features/balances/utils";
import type { FiatBalance } from "@/lib/features/balances/types";

type FiatBalanceCardProps = {
  currency: FiatCurrencyCode;
  balance: FiatBalance | null;
};

export default function FiatBalanceCard({
  currency,
  balance,
}: FiatBalanceCardProps) {
  const amount = parseBalanceValue(balance?.balance ?? 0);

  return (
    <div className="flex min-h-[160px] flex-col rounded-[16px] border border-divider-color bg-background p-[20px] shadow-[0_8px_24px_rgba(12,12,12,0.04)]">
      <div
        className="flex size-[44px] shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: getFiatFlagBackground(currency) }}
      >
        <div className="relative size-[28px] overflow-hidden rounded-full">
          <Image
            src={getFiatFlagPath(currency)}
            alt={`${currency} flag`}
            fill
            sizes="28px"
            className="object-cover"
          />
        </div>
      </div>

      <div className="mt-auto flex flex-col gap-[6px] pt-[24px]">
        <p className="text-sm text-hint-text-color">
          {getFiatBalanceLabel(currency)}
        </p>
        <p className="text-[28px] font-semibold leading-none">
          {formatFiatBalance(amount, currency)}
        </p>
      </div>
    </div>
  );
}
