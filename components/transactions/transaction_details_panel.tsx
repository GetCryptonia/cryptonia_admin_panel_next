"use client";

import StatCard from "@/components/shared/stat_card";
import { redirectIfUnauthorized } from "@/lib/api/client_action_utils";
import { reverseTransactionAction } from "@/lib/features/transactions/actions";
import type { Order } from "@/lib/features/transactions/types";
import {
  canCompleteTransaction,
  canReverseTransaction,
  formatOrderType,
  getTransactionAccountName,
} from "@/lib/features/transactions/utils";
import {
  formatDateTime,
  formatNgnAmount,
  formatUsdTokenAmount,
} from "@/lib/format";
import {
  Bank,
  Calendar,
  DocumentText,
  Hashtag,
  MoneyRecive,
  Receipt,
} from "iconsax-reactjs";
import { useTransition } from "react";

type TransactionDetailsPanelProps = {
  transaction: Order;
};

export function TransactionDetailsFooterActions({
  transaction,
  onComplete,
  onTransactionUpdated,
  onError,
}: {
  transaction: Order;
  onComplete: () => void;
  onTransactionUpdated: (order: Order) => void;
  onError: (message: string) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const showComplete = canCompleteTransaction(transaction);
  const showReverse = canReverseTransaction(transaction);

  if (!showComplete && !showReverse) {
    return null;
  }

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
    <div className="flex flex-col gap-[12px]">
      {showComplete ? (
        <button
          type="button"
          onClick={onComplete}
          className="primary-button w-full !rounded-[12px] !py-[14px] text-sm uppercase tracking-wide"
        >
          Mark completed
        </button>
      ) : null}
      {showReverse ? (
        <button
          type="button"
          onClick={handleReverse}
          disabled={isPending}
          className="w-full rounded-[12px] border border-divider-color px-[16px] py-[14px] text-sm font-semibold uppercase tracking-wide text-primary transition-colors hover:border-primary/30 disabled:opacity-50"
        >
          {isPending ? "Reversing..." : "Reverse order"}
        </button>
      ) : null}
    </div>
  );
}

export default function TransactionDetailsPanel({
  transaction,
}: TransactionDetailsPanelProps) {
  const hasPaymentDetails =
    transaction.receiverBank ||
    transaction.receiverAccountNumber ||
    transaction.receiverSessionId;

  return (
    <div className="flex flex-col gap-[28px] px-[20px] py-[24px] md:px-[24px]">
      <div className="grid grid-cols-2 gap-[12px]">
        <StatCard
          compact
          label="Token amount"
          value={formatUsdTokenAmount(transaction.tokenAmount)}
          icon={MoneyRecive}
          iconBgClassName="bg-[#ECE8FF]"
          iconColor="#7B61FF"
        />
        <StatCard
          compact
          label="Fiat amount"
          value={formatNgnAmount(transaction.fiatAmount)}
          icon={Receipt}
          iconBgClassName="bg-success-color/10"
          iconColor="var(--success-color)"
        />
        <StatCard
          compact
          label="Order type"
          value={formatOrderType(transaction.type)}
          icon={Hashtag}
          iconBgClassName="bg-primary/10"
          iconColor="var(--primary)"
        />
        <StatCard
          compact
          label="Date"
          value={formatDateTime(transaction.createdAt)}
          icon={Calendar}
          iconBgClassName="bg-[#ECEEF6]"
          iconColor="var(--secondary)"
        />
      </div>

      <section className="flex flex-col gap-[12px]">
        <div className="grid grid-cols-1 gap-[8px] sm:grid-cols-2">
          <DetailItem label="Transaction ID" value={transaction._id} mono />
          <DetailItem
            label="Account"
            value={getTransactionAccountName(transaction)}
          />
          <DetailItem label="Symbol" value={transaction.symbol ?? "—"} />
          {transaction.fee != null ? (
            <DetailItem
              label="Fee"
              value={formatNgnAmount(transaction.fee)}
            />
          ) : null}
        </div>
      </section>

      {hasPaymentDetails ? (
        <section className="flex flex-col gap-[12px]">
          <SectionLabel
            icon={Bank}
            label="Payment details"
            iconBgClassName="bg-[#ECE8FF]"
            iconColor="#7B61FF"
          />
          <div className="grid grid-cols-1 gap-[8px] sm:grid-cols-2">
            <DetailItem label="Bank" value={transaction.receiverBank ?? "—"} />
            <DetailItem
              label="Account number"
              value={transaction.receiverAccountNumber ?? "—"}
            />
            <DetailItem
              label="Session ID"
              value={transaction.receiverSessionId ?? "—"}
              mono
            />
            <DetailItem
              label="Payment ref"
              value={transaction.paymentRefId ?? "—"}
              mono
            />
          </div>
        </section>
      ) : null}

      {transaction.orderInfo || transaction.paymentInfo ? (
        <section className="flex flex-col gap-[12px]">
          <SectionLabel
            icon={DocumentText}
            label="Order breakdown"
            iconBgClassName="bg-primary/10"
            iconColor="var(--primary)"
          />
          {transaction.orderInfo ? (
            <JsonBlock title="Order info" data={transaction.orderInfo} />
          ) : null}
          {transaction.paymentInfo ? (
            <JsonBlock title="Payment info" data={transaction.paymentInfo} />
          ) : null}
        </section>
      ) : null}
    </div>
  );
}

function SectionLabel({
  icon: Icon,
  label,
  iconBgClassName,
  iconColor,
}: {
  icon: React.ComponentType<{
    size?: number | string;
    color?: string;
    variant?: "Linear" | "Outline" | "Broken" | "Bold" | "Bulk" | "TwoTone";
  }>;
  label: string;
  iconBgClassName: string;
  iconColor: string;
}) {
  return (
    <div className="flex flex-row items-center gap-[10px]">
      <div
        className={`flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-full ${iconBgClassName}`}
      >
        <Icon size={16} color={iconColor} variant="Bulk" />
      </div>
      <span className="text-sm font-semibold text-text-color">{label}</span>
    </div>
  );
}

function DetailItem({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="rounded-[12px] border border-divider-color bg-background p-[14px]">
      <p className="text-xs font-semibold uppercase tracking-wide text-hint-text-color">
        {label}
      </p>
      <p
        className={`mt-[4px] break-all text-sm font-medium ${mono ? "font-mono text-xs" : ""}`}
      >
        {value}
      </p>
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
    <div className="rounded-[12px] border border-divider-color bg-background p-[14px]">
      <p className="mb-[8px] text-xs font-semibold uppercase tracking-wide text-hint-text-color">
        {title}
      </p>
      <pre className="overflow-x-auto whitespace-pre-wrap break-all text-xs">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
