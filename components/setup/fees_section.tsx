"use client";

import FeeFormModal from "@/components/setup/fee_form_modal";
import { redirectIfUnauthorized } from "@/lib/api/client_action_utils";
import { deleteTransactionFeeAction } from "@/lib/features/setup/actions";
import type { FeeTier } from "@/lib/features/setup/types";
import {
  formatCurrencyTypeLabel,
  formatFeeAmount,
  formatFeeTypeLabel,
  formatTransactionTypeLabel,
  sortFeeTiers,
} from "@/lib/features/setup/utils";
import { useMemo, useState, useTransition } from "react";

type FeesSectionProps = {
  fees: FeeTier[];
  onError: (message: string) => void;
  disabled?: boolean;
};

export default function FeesSection({
  fees,
  onError,
  disabled = false,
}: FeesSectionProps) {
  const [localFees, setLocalFees] = useState(fees);
  const [editingFee, setEditingFee] = useState<FeeTier | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const sortedFees = useMemo(() => sortFeeTiers(localFees), [localFees]);
  const isModalOpen = isCreateOpen || editingFee !== null;

  const handleSaved = (fee: FeeTier) => {
    setLocalFees((current) => {
      const existingIndex = current.findIndex((item) => item._id === fee._id);

      if (existingIndex === -1) {
        return [...current, fee];
      }

      return current.map((item, index) =>
        index === existingIndex ? fee : item,
      );
    });
  };

  const handleDelete = (feeId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this transaction fee?",
    );

    if (!confirmed) return;

    startTransition(async () => {
      const result = await deleteTransactionFeeAction(feeId);

      if (redirectIfUnauthorized(result)) {
        return;
      }

      if (!result.ok) {
        onError(result.message);
        return;
      }

      setLocalFees((current) => current.filter((fee) => fee._id !== feeId));
    });
  };

  return (
    <>
      <section className="flex flex-col gap-[20px]">
        <div className="flex flex-row flex-wrap items-center justify-between gap-[12px]">
          <h2 className="text-[20px] font-semibold">Transaction Fees</h2>
          <button
            type="button"
            className="primary-button !rounded-[12px] !px-[16px] !py-[10px] text-xs uppercase tracking-wide"
            onClick={() => setIsCreateOpen(true)}
            disabled={disabled || isPending}
          >
            Add Fee
          </button>
        </div>

        <div className="overflow-hidden rounded-[16px] border border-divider-color bg-background shadow-[0_8px_24px_rgba(12,12,12,0.04)]">
          {sortedFees.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-divider-color bg-background">
                    {[
                      "Currency Type",
                      "Currency",
                      "Type",
                      "Min",
                      "Max",
                      "Fee",
                      "Fee Type",
                      "Actions",
                    ].map((header) => (
                      <th
                        key={header}
                        className="px-[20px] py-[16px] text-xs font-semibold uppercase tracking-wide text-hint-text-color"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sortedFees.map((fee) => (
                    <tr
                      key={fee._id}
                      className="border-b border-divider-color last:border-b-0"
                    >
                      <td className="px-[20px] py-[18px]">
                        {formatCurrencyTypeLabel(fee.currencyType)}
                      </td>
                      <td className="px-[20px] py-[18px] uppercase">
                        {fee.currency}
                      </td>
                      <td className="px-[20px] py-[18px]">
                        {formatTransactionTypeLabel(fee.transactionType)}
                      </td>
                      <td className="px-[20px] py-[18px]">
                        {fee.minAmount.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td className="px-[20px] py-[18px]">
                        {fee.maxAmount === null
                          ? "—"
                          : fee.maxAmount.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                      </td>
                      <td className="px-[20px] py-[18px]">
                        {formatFeeAmount(fee)}
                      </td>
                      <td className="px-[20px] py-[18px]">
                        {formatFeeTypeLabel(fee.feeType)}
                      </td>
                      <td className="px-[20px] py-[18px]">
                        <div className="flex flex-row flex-wrap gap-[12px]">
                          <button
                            type="button"
                            className="text-link !text-xs uppercase tracking-wide"
                            onClick={() => setEditingFee(fee)}
                            disabled={disabled || isPending}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="text-xs font-semibold uppercase tracking-wide text-primary"
                            onClick={() => handleDelete(fee._id)}
                            disabled={disabled || isPending}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-[20px] py-[48px] text-center text-sm text-hint-text-color">
              No transaction fees configured yet.
            </div>
          )}
        </div>

      </section>

      {isModalOpen ? (
        <FeeFormModal
          fee={editingFee}
          onClose={() => {
            setEditingFee(null);
            setIsCreateOpen(false);
          }}
          onSaved={handleSaved}
          onError={onError}
        />
      ) : null}
    </>
  );
}
