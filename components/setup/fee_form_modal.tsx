"use client";

import { useEffect, useState, useTransition } from "react";
import { redirectIfUnauthorized } from "@/lib/api/client_action_utils";
import {
  createTransactionFeeAction,
  updateTransactionFeeAction,
} from "@/lib/features/setup/actions";
import type {
  CreateFeeTierPayload,
  FeeTier,
} from "@/lib/features/setup/types";

type FeeFormModalProps = {
  fee: FeeTier | null;
  onClose: () => void;
  onSaved: (fee: FeeTier) => void;
  onError: (message: string) => void;
};

const EMPTY_FORM: CreateFeeTierPayload = {
  currencyType: "stablecoin",
  currency: "usd",
  transactionType: "deposit",
  minAmount: 0,
  maxAmount: 0,
  fee: 0,
  feeType: "fixed",
};

export default function FeeFormModal({
  fee,
  onClose,
  onSaved,
  onError,
}: FeeFormModalProps) {
  const isEditing = fee !== null;
  const [form, setForm] = useState<CreateFeeTierPayload>(EMPTY_FORM);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (fee) {
      setForm({
        currencyType: fee.currencyType,
        currency: fee.currency,
        transactionType: fee.transactionType,
        minAmount: fee.minAmount,
        maxAmount: fee.maxAmount ?? 0,
        fee: fee.fee,
        feeType: fee.feeType,
      });
      return;
    }

    setForm(EMPTY_FORM);
  }, [fee]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    startTransition(async () => {
      const result = isEditing
        ? await updateTransactionFeeAction(fee._id, form)
        : await createTransactionFeeAction(form);

      if (redirectIfUnauthorized(result)) {
        return;
      }

      if (!result.ok) {
        onError(result.message);
        return;
      }

      onSaved(result.data);
      onClose();
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-[24px]">
      <div className="w-full max-w-[520px] rounded-[16px] border border-divider-color bg-background p-[24px] shadow-[0_16px_48px_rgba(12,12,12,0.16)]">
        <div className="mb-[24px] flex flex-row items-center justify-between gap-[12px]">
          <h2 className="text-[20px] font-semibold">
            {isEditing ? "Edit Transaction Fee" : "Add Transaction Fee"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-sm font-semibold uppercase tracking-wide text-hint-text-color"
            disabled={isPending}
          >
            Close
          </button>
        </div>

        <form className="flex flex-col gap-[16px]" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-[16px] sm:grid-cols-2">
            <div className="flex flex-col gap-[8px]">
              <label className="text-xs font-semibold uppercase tracking-wide text-hint-text-color">
                Currency type
              </label>
              <select
                value={form.currencyType}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    currencyType: event.target.value as CreateFeeTierPayload["currencyType"],
                  }))
                }
                disabled={isPending}
                className="rounded-[12px] border-none bg-divider-color px-[16px] py-[16px] text-sm outline-none focus:border focus:border-primary"
              >
                <option value="stablecoin">Stablecoin</option>
                <option value="fiat">Fiat</option>
              </select>
            </div>

            <div className="flex flex-col gap-[8px]">
              <label className="text-xs font-semibold uppercase tracking-wide text-hint-text-color">
                Currency
              </label>
              <input
                type="text"
                value={form.currency}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    currency: event.target.value.toLowerCase(),
                  }))
                }
                placeholder="usd"
                disabled={isPending}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-[16px] sm:grid-cols-2">
            <div className="flex flex-col gap-[8px]">
              <label className="text-xs font-semibold uppercase tracking-wide text-hint-text-color">
                Transaction type
              </label>
              <select
                value={form.transactionType}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    transactionType: event.target.value as CreateFeeTierPayload["transactionType"],
                  }))
                }
                disabled={isPending}
                className="rounded-[12px] border-none bg-divider-color px-[16px] py-[16px] text-sm outline-none focus:border focus:border-primary"
              >
                <option value="deposit">Deposit</option>
                <option value="withdraw">Withdraw</option>
              </select>
            </div>

            <div className="flex flex-col gap-[8px]">
              <label className="text-xs font-semibold uppercase tracking-wide text-hint-text-color">
                Fee type
              </label>
              <select
                value={form.feeType}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    feeType: event.target.value as CreateFeeTierPayload["feeType"],
                  }))
                }
                disabled={isPending}
                className="rounded-[12px] border-none bg-divider-color px-[16px] py-[16px] text-sm outline-none focus:border focus:border-primary"
              >
                <option value="fixed">Fixed</option>
                <option value="percentage">Percentage</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-[16px] sm:grid-cols-2">
            <div className="flex flex-col gap-[8px]">
              <label className="text-xs font-semibold uppercase tracking-wide text-hint-text-color">
                Min amount
              </label>
              <input
                type="number"
                min="0"
                step="any"
                value={form.minAmount}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    minAmount: Number.parseFloat(event.target.value) || 0,
                  }))
                }
                disabled={isPending}
                required
              />
            </div>

            <div className="flex flex-col gap-[8px]">
              <label className="text-xs font-semibold uppercase tracking-wide text-hint-text-color">
                Max amount
              </label>
              <input
                type="number"
                min="0"
                step="any"
                value={form.maxAmount}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    maxAmount: Number.parseFloat(event.target.value) || 0,
                  }))
                }
                disabled={isPending}
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-[8px]">
            <label className="text-xs font-semibold uppercase tracking-wide text-hint-text-color">
              Fee
            </label>
            <input
              type="number"
              min="0"
              step="any"
              value={form.fee}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  fee: Number.parseFloat(event.target.value) || 0,
                }))
              }
              disabled={isPending}
              required
            />
          </div>

          <button
            type="submit"
            className="primary-button mt-[8px] !rounded-[12px] !py-[12px] text-sm uppercase tracking-wide"
            disabled={isPending}
          >
            {isPending
              ? "Saving..."
              : isEditing
                ? "Update Fee"
                : "Create Fee"}
          </button>
        </form>
      </div>
    </div>
  );
}
