"use client";

import TransactionsMiniTable from "@/components/transactions/transactions_mini_table";
import StatCard from "@/components/shared/stat_card";
import type { WalletDetails } from "@/lib/features/wallets/types";
import { formatDate, formatDateTime, formatNgnAmount, formatTokenAmount } from "@/lib/format";
import { useState } from "react";

type WalletDetailsPanelProps = {
  details: WalletDetails;
};

export default function WalletDetailsPanel({ details }: WalletDetailsPanelProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyUserId = async () => {
    try {
      await navigator.clipboard.writeText(details.user.id);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="flex flex-col gap-[24px] border-t border-divider-color bg-divider-color/20 px-[20px] py-[24px] md:px-[24px]">
      <div className="grid grid-cols-1 gap-[16px] sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Balance" value={formatTokenAmount(details.wallet.balance)} />
        <StatCard label="Total inflow" value={formatNgnAmount(details.totalInflow)} />
        <StatCard label="Total outflow" value={formatNgnAmount(details.totalOutflow)} />
        <StatCard
          label="Last transaction"
          value={formatDateTime(details.wallet.lastTransactionDate)}
        />
      </div>

      <section className="flex flex-col gap-[12px]">
        <h3 className="text-base font-semibold">User information</h3>
        <div className="grid grid-cols-1 gap-[12px] md:grid-cols-2">
          <InfoItem label="Username" value={details.user.username} />
          <InfoItem label="Email" value={details.user.email} />
          <InfoItem
            label="Name"
            value={`${details.user.firstName ?? ""} ${details.user.lastName ?? ""}`.trim() || "—"}
          />
          <InfoItem label="Tag" value={details.wallet.tag ?? "—"} />
          <InfoItem label="Wallet created" value={formatDate(details.wallet.createdAt)} />
          <div className="rounded-[12px] border border-divider-color bg-background p-[16px]">
            <p className="text-xs font-semibold uppercase tracking-wide text-hint-text-color">
              User ID
            </p>
            <div className="mt-[8px] flex flex-row flex-wrap items-center gap-[12px]">
              <span className="break-all font-mono text-sm">{details.user.id}</span>
              <button
                type="button"
                onClick={handleCopyUserId}
                className="rounded-[10px] border border-divider-color px-[12px] py-[6px] text-xs font-semibold uppercase tracking-wide transition-colors hover:border-primary/30"
              >
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-[12px]">
        <h3 className="text-base font-semibold">Recent transactions</h3>
        <TransactionsMiniTable transactions={details.recentTransactions} />
      </section>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[12px] border border-divider-color bg-background p-[16px]">
      <p className="text-xs font-semibold uppercase tracking-wide text-hint-text-color">
        {label}
      </p>
      <p className="mt-[8px] break-all text-sm font-medium">{value}</p>
    </div>
  );
}
