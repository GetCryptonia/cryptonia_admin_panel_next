"use client";

import { redirectIfUnauthorized } from "@/lib/api/client_action_utils";
import { completeTransactionAction } from "@/lib/features/transactions/actions";
import type { Order } from "@/lib/features/transactions/types";
import { useState, useTransition } from "react";

type CompleteTransactionModalProps = {
  transaction: Order;
  onClose: () => void;
  onCompleted: (order: Order) => void;
  onError: (message: string) => void;
};

export default function CompleteTransactionModal({
  transaction,
  onClose,
  onCompleted,
  onError,
}: CompleteTransactionModalProps) {
  const [paymentRefId, setPaymentRefId] = useState(
    transaction.paymentRefId ?? transaction.receiverSessionId ?? "",
  );
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    startTransition(async () => {
      const result = await completeTransactionAction(transaction._id, {
        paymentRefId: paymentRefId.trim(),
      });

      if (redirectIfUnauthorized(result)) {
        return;
      }

      if (!result.ok) {
        onError(result.message);
        return;
      }

      onCompleted(result.data);
      onClose();
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-[24px]">
      <div className="w-full max-w-[480px] rounded-[16px] border border-divider-color bg-background p-[24px] shadow-[0_16px_48px_rgba(12,12,12,0.16)]">
        <div className="mb-[20px] flex flex-row items-center justify-between gap-[12px]">
          <h2 className="text-[20px] font-semibold">Mark as completed</h2>
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
          <p className="text-sm text-hint-text-color">
            Provide the session ID or payment reference to complete this
            transaction.
          </p>

          <div className="flex flex-col gap-[8px]">
            <label className="text-xs font-semibold uppercase tracking-wide text-hint-text-color">
              Session ID / payment reference
            </label>
            <input
              type="text"
              value={paymentRefId}
              onChange={(event) => setPaymentRefId(event.target.value)}
              placeholder="Enter session ID or hash"
              disabled={isPending}
              required
              className="!rounded-[10px] !border !border-divider-color !bg-surface-color !py-[10px] !px-[14px] text-sm focus:!border-primary"
            />
          </div>

          <button
            type="submit"
            className="primary-button mt-[8px] !rounded-[12px] !py-[12px] text-sm uppercase tracking-wide"
            disabled={isPending}
          >
            {isPending ? "Completing..." : "Mark completed"}
          </button>
        </form>
      </div>
    </div>
  );
}
