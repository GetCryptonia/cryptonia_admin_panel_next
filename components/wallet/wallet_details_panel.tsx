"use client";

import TransactionsMiniTable from "@/components/transactions/transactions_mini_table";
import CopyableIdField from "@/components/shared/copyable_id_field";
import StatCard from "@/components/shared/stat_card";
import type { WalletDetails } from "@/lib/features/wallets/types";
import {
  formatDate,
  formatDateTime,
  formatUsdTokenAmount,
} from "@/lib/format";
import {
  Clock,
  DocumentText,
  MoneyRecive,
  MoneySend,
  Profile2User,
  Wallet2,
} from "iconsax-reactjs";

type WalletDetailsPanelProps = {
  details: WalletDetails;
};

export default function WalletDetailsPanel({ details }: WalletDetailsPanelProps) {
  const fullName =
    `${details.user.firstName ?? ""} ${details.user.lastName ?? ""}`.trim() ||
    "—";

  return (
    <div className="flex flex-col gap-[28px] px-[20px] py-[24px] md:px-[24px]">
      <div className="grid grid-cols-2 gap-[12px]">
        <StatCard
          compact
          label="Balance"
          value={formatUsdTokenAmount(details.wallet.balance)}
          icon={Wallet2}
          iconBgClassName="bg-[#ECE8FF]"
          iconColor="#7B61FF"
        />
        <StatCard
          compact
          label="Total inflow"
          value={formatUsdTokenAmount(details.totalInflow)}
          icon={MoneyRecive}
          iconBgClassName="bg-success-color/10"
          iconColor="var(--success-color)"
        />
        <StatCard
          compact
          label="Total outflow"
          value={formatUsdTokenAmount(details.totalOutflow)}
          icon={MoneySend}
          iconBgClassName="bg-primary/10"
          iconColor="var(--primary)"
        />
        <StatCard
          compact
          label="Last transaction"
          value={formatDateTime(details.wallet.lastTransactionDate)}
          icon={Clock}
          iconBgClassName="bg-[#ECEEF6]"
          iconColor="var(--secondary)"
        />
      </div>

      <section className="flex flex-col gap-[12px]">
        <SectionLabel
          icon={Profile2User}
          label="User information"
          iconBgClassName="bg-[#ECE8FF]"
          iconColor="#7B61FF"
        />
        <div className="grid grid-cols-1 gap-[8px] sm:grid-cols-2">
          <InfoItem label="Username" value={details.user.username} />
          <InfoItem label="Email" value={details.user.email} />
          <InfoItem label="Name" value={fullName} />
          <InfoItem label="Tag" value={details.wallet.tag ?? "—"} />
          <InfoItem
            label="Wallet created"
            value={formatDate(details.wallet.createdAt)}
          />
          <CopyableIdField value={details.user.id} />
        </div>
      </section>

      <section className="flex flex-col gap-[12px]">
        <SectionLabel
          icon={DocumentText}
          label="Recent transactions"
          iconBgClassName="bg-primary/10"
          iconColor="var(--primary)"
        />
        <TransactionsMiniTable
          transactions={details.recentTransactions}
          amountVariant="token"
        />
      </section>
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

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[12px] border border-divider-color bg-background p-[14px]">
      <p className="text-xs font-semibold uppercase tracking-wide text-hint-text-color">
        {label}
      </p>
      <p className="mt-[4px] break-all text-sm font-medium">{value}</p>
    </div>
  );
}
