"use client";

import { redirectIfUnauthorized } from "@/lib/api/client_action_utils";
import { reverseTransactionAction } from "@/lib/features/transactions/actions";
import type { Order } from "@/lib/features/transactions/types";
import {
  canCompleteTransaction,
  canReverseTransaction,
  formatOrderStatus,
  formatOrderType,
  getOrderStatusClass,
  getTransactionAccountName,
} from "@/lib/features/transactions/utils";
import { formatDateTime, formatNgnAmount } from "@/lib/format";
import { useTransition } from "react";

type TransactionDetailsPanelProps = {
  transaction: Order;
  onTransactionUpdated: (order: Order) => void;
  onComplete: () => void;
  onError: (message: string) => void;
};

export default function TransactionDetailsPanel({
  transaction,
  onTransactionUpdated,
  onComplete,
  onError,
}: TransactionDetailsPanelProps) {
  const [isPending, startTransition] = useTransition();

  const handleReverse = () => {
    if (
      !window.confirm(
        "Reverse this transaction and credit the user's wallet? This action cannot be undone.",
      )
    ) {
      return;
    }

    startTransition(async () => {
      const result = await reverseTransactionAction(transaction._id);

      if (redirectIfUnauthorized(result)) {
        return;
      }

      if (!result.ok) {
        onError(result.message);
        return;
      }

      onTransactionUpdated(result.data.order);
    });
  };

  return (
    <div className="flex flex-col gap-[24px] border-t border-divider-color bg-divider-color/20 px-[20px] py-[24px]">
      <div className="grid grid-cols-1 gap-[16px] md:grid-cols-2 xl:grid-cols-4">
        <DetailItem label="Transaction ID" value={transaction._id} />
        <DetailItem
          label="Account"
          value={getTransactionAccountName(transaction)}
        />
        <DetailItem label="Order type" value={formatOrderType(transaction.type)} />
        <DetailItem
          label="Status"
          value={
            <span
              className={`rounded-full px-[10px] py-[4px] text-xs font-semibold ${getOrderStatusClass(transaction.status)}`}
            >
              {formatOrderStatus(transaction.status)}
            </span>
          }
        />
        <DetailItem label="Token amount" value={String(transaction.tokenAmount)} />
        <DetailItem label="Fiat amount" value={formatNgnAmount(transaction.fiatAmount)} />
        <DetailItem label="Symbol" value={transaction.symbol ?? "—"} />
        <DetailItem label="Date" value={formatDateTime(transaction.createdAt)} />
      </div>

      {(transaction.receiverBank ||
        transaction.receiverAccountNumber ||
        transaction.receiverSessionId) && (
          <section className="flex flex-col gap-[12px]">
            <h3 className="text-base font-semibold">Payment details</h3>
            <div className="grid grid-cols-1 gap-[12px] md:grid-cols-2">
              <DetailItem label="Bank" value={transaction.receiverBank ?? "—"} />
              <DetailItem
                label="Account number"
                value={transaction.receiverAccountNumber ?? "—"}
              />
              <DetailItem
                label="Session ID"
                value={transaction.receiverSessionId ?? "—"}
              />
              <DetailItem
                label="Payment ref"
                value={transaction.paymentRefId ?? "—"}
              />
            </div>
          </section>
        )}

      {(transaction.orderInfo || transaction.paymentInfo) && (
        <section className="flex flex-col gap-[12px]">
          <h3 className="text-base font-semibold">Order breakdown</h3>
          {transaction.orderInfo ? (
            <JsonBlock title="Order info" data={transaction.orderInfo} />
          ) : null}
          {transaction.paymentInfo ? (
            <JsonBlock title="Payment info" data={transaction.paymentInfo} />
          ) : null}
        </section>
      )}

      <div className="flex flex-row flex-wrap gap-[12px]">
        {canCompleteTransaction(transaction) ? (
          <button
            type="button"
            onClick={onComplete}
            className="primary-button !rounded-[12px] !px-[16px] !py-[10px] text-xs uppercase tracking-wide"
          >
            Mark completed
          </button>
        ) : null}
        {canReverseTransaction(transaction) ? (
          <button
            type="button"
            onClick={handleReverse}
            disabled={isPending}
            className="rounded-[10px] border border-divider-color px-[16px] py-[10px] text-xs font-semibold uppercase tracking-wide"
          >
            {isPending ? "Reversing..." : "Reverse order"}
          </button>
        ) : null}
      </div>
    </div>
  );
}

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-[12px] border border-divider-color bg-background p-[16px]">
      <p className="text-xs font-semibold uppercase tracking-wide text-hint-text-color">
        {label}
      </p>
      <div className="mt-[8px] break-all text-sm font-medium">{value}</div>
    </div>
  );
}

function JsonBlock({
  title,
  data,
}: {
  title: string;
  data: Record<string, unknown>;
}) {
  return (
    <div className="rounded-[12px] border border-divider-color bg-background p-[16px]">
      <p className="mb-[8px] text-xs font-semibold uppercase tracking-wide text-hint-text-color">
        {title}
      </p>
      <pre className="overflow-x-auto whitespace-pre-wrap break-all text-xs">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
