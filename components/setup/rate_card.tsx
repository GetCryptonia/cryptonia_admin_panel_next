"use client";

import Image from "next/image";
import { ArrowRight2 } from "iconsax-reactjs";
import { useEffect, useState, useTransition } from "react";
import { redirectIfUnauthorized } from "@/lib/api/client_action_utils";
import { updateRateAction } from "@/lib/features/setup/actions";
import type { Rate } from "@/lib/features/setup/types";
import {
  areRateValuesDirty,
  formatRateInput,
  getFiatFlagBackground,
  getFiatFlagPath,
  getRateFormValues,
  isValidRateValues,
  parseRateInput,
  type FiatCurrencyCode,
  type RateFormValues,
} from "@/lib/features/setup/utils";

type RateCardProps = {
  currency: FiatCurrencyCode;
  rate: Rate | null;
  onSaved: (rate: Rate) => void;
  onError: (message: string) => void;
  disabled?: boolean;
};

export default function RateCard({
  currency,
  rate,
  onSaved,
  onError,
  disabled = false,
}: RateCardProps) {
  const savedValues = getRateFormValues(rate);
  const [formValues, setFormValues] = useState<RateFormValues>(savedValues);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setFormValues(getRateFormValues(rate));
  }, [rate]);

  const isDirty = areRateValuesDirty(formValues, savedValues);
  const canSave =
    isDirty && isValidRateValues(formValues) && !disabled && !isPending;

  const handleWithdrawalChange = (value: string) => {
    setFormValues((current) => ({
      ...current,
      withdrawalRate: parseRateInput(value),
    }));
  };

  const handleDepositChange = (value: string) => {
    setFormValues((current) => ({
      ...current,
      depositRate: parseRateInput(value),
    }));
  };

  const handleSave = () => {
    if (!canSave) return;

    startTransition(async () => {
      const result = await updateRateAction({
        currency,
        rate: formValues.withdrawalRate,
        buyRate: formValues.depositRate,
      });

      if (redirectIfUnauthorized(result)) {
        return;
      }

      if (!result.ok) {
        onError(result.message);
        return;
      }

      onSaved(result.data);
    });
  };

  return (
    <div className="flex flex-col rounded-[16px] border border-divider-color bg-background p-[20px] shadow-[0_8px_24px_rgba(12,12,12,0.04)] md:p-[24px]">
      <div className="mb-[20px] flex flex-row items-center gap-[12px]">
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
        <h3 className="text-[18px] font-semibold">{currency}</h3>
      </div>

      {!rate ? (
        <p className="mb-[20px] text-sm text-hint-text-color">
          No rate configured for this currency yet.
        </p>
      ) : null}

      <div className="flex flex-col gap-[16px]">
        <div className="flex flex-col gap-[8px]">
          <label className="text-xs font-semibold uppercase tracking-wide text-hint-text-color">
            Withdrawal rate
          </label>
          <input
            type="text"
            inputMode="decimal"
            value={formatRateInput(formValues.withdrawalRate, currency)}
            onChange={(event) => handleWithdrawalChange(event.target.value)}
            disabled={disabled || isPending}
          />
        </div>

        <div className="flex items-center justify-center">
          <ArrowRight2 size={20} color="var(--primary)" variant="Bold" />
        </div>

        <div className="flex flex-col gap-[8px]">
          <label className="text-xs font-semibold uppercase tracking-wide text-hint-text-color">
            Deposit rate
          </label>
          <input
            type="text"
            inputMode="decimal"
            value={formatRateInput(formValues.depositRate, currency)}
            onChange={(event) => handleDepositChange(event.target.value)}
            disabled={disabled || isPending}
          />
        </div>
      </div>

      <button
        type="button"
        className="primary-button mt-[24px] self-start !rounded-[12px] !px-[20px] !py-[12px] text-xs uppercase tracking-wide"
        disabled={!canSave}
        onClick={handleSave}
      >
        {isPending ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
}
