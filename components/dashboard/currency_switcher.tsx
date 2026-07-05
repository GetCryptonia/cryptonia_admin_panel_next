"use client";

import { assets } from "@/lib/utils/assets";
import type { DashboardCurrency } from "@/lib/features/dashboard/utils";
import Image from "next/image";

type CurrencySwitcherProps = {
  currency: DashboardCurrency;
  onChange: (currency: DashboardCurrency) => void;
};

const options: { value: DashboardCurrency; label: string; flag: string }[] = [
  { value: "USD", label: "USD", flag: assets.flagUS },
  { value: "NGN", label: "NGN", flag: assets.flagNG },
];

export default function CurrencySwitcher({
  currency,
  onChange,
}: CurrencySwitcherProps) {
  return (
    <div className="flex flex-row gap-[12px]">
      {options.map((option) => {
        const isActive = currency === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`flex flex-row items-center gap-[8px] rounded-full border px-[16px] py-[8px] text-sm font-medium transition-colors ${
              isActive
                ? "border-primary text-text-color"
                : "border-divider-color text-hint-text-color"
            }`}
          >
            <Image src={option.flag} alt={option.label} width={20} height={20} />
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
