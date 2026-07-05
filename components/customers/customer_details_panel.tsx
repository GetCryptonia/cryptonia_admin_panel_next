"use client";

import TransactionsMiniTable from "@/components/transactions/transactions_mini_table";
import StatCard from "@/components/shared/stat_card";
import { redirectIfUnauthorized } from "@/lib/api/client_action_utils";
import { toggleCustomerBlockAction } from "@/lib/features/customers/actions";
import type { Customer, CustomerDetails } from "@/lib/features/customers/types";
import { formatNgnAmount, formatUsdTokenAmount } from "@/lib/format";
import {
  Bank,
  Clock,
  DocumentText,
  MoneyRecive,
  MoneySend,
  SecuritySafe,
  Wallet2,
} from "iconsax-reactjs";
import { useTransition } from "react";

type CustomerDetailsPanelProps = {
  details: CustomerDetails;
};

export function CustomerDetailsBlockAction({
  customer,
  onCustomerUpdated,
  onError,
}: {
  customer: Customer;
  onCustomerUpdated: (customer: Customer) => void;
  onError: (message: string) => void;
}) {
  const [isPending, startTransition] = useTransition();

  const handleToggleBlock = () => {
    startTransition(async () => {
      const result = await toggleCustomerBlockAction(customer.id);

      if (redirectIfUnauthorized(result)) {
        return;
      }

      if (!result.ok) {
        onError(result.message);
        return;
      }

      onCustomerUpdated({
        ...customer,
        active: result.data.active,
      });
    });
  };

  return (
    <button
      type="button"
      onClick={handleToggleBlock}
      disabled={isPending}
      className="primary-button w-full !rounded-[12px] !py-[14px] text-sm uppercase tracking-wide"
    >
      {isPending
        ? "Updating..."
        : customer.active
          ? "Block customer"
          : "Unblock customer"}
    </button>
  );
}

export default function CustomerDetailsPanel({
  details,
}: CustomerDetailsPanelProps) {
  return (
    <div className="flex flex-col gap-[28px] px-[20px] py-[24px] md:px-[24px]">
      <div className="grid grid-cols-2 gap-[12px]">
        <StatCard
          compact
          label="Wallet balance"
          value={formatUsdTokenAmount(details.book.balance)}
          icon={Wallet2}
          iconBgClassName="bg-[#ECE8FF]"
          iconColor="#7B61FF"
        />
        <StatCard
          compact
          label="Inflow"
          value={formatUsdTokenAmount(details.book.inflow)}
          icon={MoneyRecive}
          iconBgClassName="bg-success-color/10"
          iconColor="var(--success-color)"
        />
        <StatCard
          compact
          label="Outflow"
          value={formatUsdTokenAmount(details.book.outflow)}
          icon={MoneySend}
          iconBgClassName="bg-primary/10"
          iconColor="var(--primary)"
        />
        <StatCard
          compact
          label="Processing"
          value={formatUsdTokenAmount(details.book.processing)}
          icon={Clock}
          iconBgClassName="bg-[#ECEEF6]"
          iconColor="var(--secondary)"
        />
      </div>

      <section className="flex flex-col gap-[12px]">
        <SectionLabel
          icon={Bank}
          label="Bank accounts"
          iconBgClassName="bg-[#ECE8FF]"
          iconColor="#7B61FF"
        />
        {details.bankAccounts.length === 0 ? (
          <p className="text-sm text-hint-text-color">No bank accounts added.</p>
        ) : (
          <div className="flex flex-col gap-[8px]">
            {details.bankAccounts.map((account) => (
              <div
                key={account._id ?? `${account.bankCode}-${account.accountNumber}`}
                className="rounded-[12px] border border-divider-color bg-background p-[14px]"
              >
                <p className="font-medium">{account.bankName}</p>
                <p className="mt-[4px] text-sm text-hint-text-color">
                  {account.accountName}
                </p>
                <p className="mt-[2px] font-mono text-sm">{account.accountNumber}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="flex flex-col gap-[12px]">
        <SectionLabel
          icon={SecuritySafe}
          label={`KYC · Tier ${details.kycStatus.tier}`}
          iconBgClassName="bg-success-color/10"
          iconColor="var(--success-color)"
        />
        <div className="flex flex-col gap-[8px]">
          {details.kycStatus.kycInfo.map((tier) => (
            <div
              key={tier.key}
              className="flex flex-row items-start justify-between gap-[12px] rounded-[12px] border border-divider-color bg-background p-[14px]"
            >
              <div className="min-w-0 flex-1">
                <p className="font-medium">{tier.title}</p>
                <p className="mt-[4px] text-sm text-hint-text-color">
                  {tier.requirement}
                </p>
                <p className="mt-[6px] text-xs text-hint-text-color">
                  Deposit limit: {formatNgnAmount(tier.fiatDepositLimit)}
                </p>
              </div>
              <span
                className={`shrink-0 rounded-full px-[10px] py-[4px] text-xs font-semibold ${
                  tier.verified
                    ? "bg-success-color/10 text-success-color"
                    : "bg-hint-text-color/10 text-hint-text-color"
                }`}
              >
                {tier.verificationStatus}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-[12px]">
        <SectionLabel
          icon={DocumentText}
          label="Recent transactions"
          iconBgClassName="bg-primary/10"
          iconColor="var(--primary)"
        />
        <TransactionsMiniTable transactions={details.recentTransactions} />
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
