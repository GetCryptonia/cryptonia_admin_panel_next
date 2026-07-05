"use client";

import { redirectIfUnauthorized } from "@/lib/api/client_action_utils";
import {
  createClaimableRewardsAction,
  createVoucherRewardsAction,
} from "@/lib/features/rewards/actions";
import { RewardType } from "@/lib/features/rewards/types";
import {
  CLAIMABLE_REWARD_TYPES,
  formatRewardType,
  VOUCHER_REWARD_TYPES,
} from "@/lib/features/rewards/utils";
import FilterSelect from "@/components/shared/filter_select";
import { useState, useTransition } from "react";

type RewardCreationMode = "claimable" | "voucher";

type CreateRewardModalProps = {
  onClose: () => void;
  onCreated: () => void;
  onError: (message: string) => void;
};

export default function CreateRewardModal({
  onClose,
  onCreated,
  onError,
}: CreateRewardModalProps) {
  const [mode, setMode] = useState<RewardCreationMode>("claimable");
  const [type, setType] = useState<RewardType>(RewardType.CASHBACK);
  const [claimableAmount, setClaimableAmount] = useState(100);
  const [amount, setAmount] = useState(1);
  const [voucherCodes, setVoucherCodes] = useState("");
  const [isPending, startTransition] = useTransition();

  const typeOptions =
    mode === "claimable" ? CLAIMABLE_REWARD_TYPES : VOUCHER_REWARD_TYPES;

  const handleModeChange = (nextMode: RewardCreationMode) => {
    setMode(nextMode);
    setType(
      nextMode === "claimable"
        ? RewardType.CASHBACK
        : RewardType.SHOWMAX_VOUCHER,
    );
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    startTransition(async () => {
      const result =
        mode === "claimable"
          ? await createClaimableRewardsAction({
              claimableAmount,
              amount,
              type,
            })
          : await createVoucherRewardsAction({
              type,
              voucherCodes: voucherCodes
                .split(/[\n,]/)
                .map((code) => code.trim())
                .filter(Boolean),
            });

      if (redirectIfUnauthorized(result)) {
        return;
      }

      if (!result.ok) {
        onError(result.message);
        return;
      }

      onCreated();
      onClose();
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-[24px]">
      <div className="w-full max-w-[520px] rounded-[16px] border border-divider-color bg-background p-[24px] shadow-[0_16px_48px_rgba(12,12,12,0.16)]">
        <div className="mb-[20px] flex flex-row items-center justify-between gap-[12px]">
          <h2 className="text-[20px] font-semibold">Create reward</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-sm font-semibold uppercase tracking-wide text-hint-text-color"
            disabled={isPending}
          >
            Close
          </button>
        </div>

        <div className="mb-[20px] flex flex-row flex-wrap gap-[12px]">
          {(["claimable", "voucher"] as RewardCreationMode[]).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => handleModeChange(option)}
              className={`rounded-[10px] border px-[16px] py-[8px] text-xs font-semibold uppercase tracking-wide ${
                mode === option
                  ? "border-primary text-text-color"
                  : "border-divider-color text-hint-text-color"
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        <form className="flex flex-col gap-[16px]" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-[8px]">
            <label className="text-xs font-semibold uppercase tracking-wide text-hint-text-color">
              Reward type
            </label>
            <FilterSelect
              value={type}
              onChange={(value) => setType(value as RewardType)}
              disabled={isPending}
              className="w-full min-w-0"
            >
              {typeOptions.map((option) => (
                <option key={option} value={option}>
                  {formatRewardType(option)}
                </option>
              ))}
            </FilterSelect>
          </div>

          {mode === "claimable" ? (
            <>
              <div className="flex flex-col gap-[8px]">
                <label className="text-xs font-semibold uppercase tracking-wide text-hint-text-color">
                  Claimable amount
                </label>
                <input
                  type="number"
                  min="1"
                  value={claimableAmount}
                  onChange={(event) =>
                    setClaimableAmount(Number.parseFloat(event.target.value) || 0)
                  }
                  disabled={isPending}
                  required
                  className="!rounded-[10px] !border !border-divider-color !bg-background !py-[10px] !px-[14px] text-sm focus:!border-primary"
                />
              </div>
              <div className="flex flex-col gap-[8px]">
                <label className="text-xs font-semibold uppercase tracking-wide text-hint-text-color">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  value={amount}
                  onChange={(event) =>
                    setAmount(Number.parseInt(event.target.value, 10) || 0)
                  }
                  disabled={isPending}
                  required
                  className="!rounded-[10px] !border !border-divider-color !bg-background !py-[10px] !px-[14px] text-sm focus:!border-primary"
                />
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-[8px]">
              <label className="text-xs font-semibold uppercase tracking-wide text-hint-text-color">
                Voucher codes
              </label>
              <textarea
                value={voucherCodes}
                onChange={(event) => setVoucherCodes(event.target.value)}
                placeholder="Enter one code per line or comma-separated"
                disabled={isPending}
                required
                className="min-h-[120px] rounded-[10px] border border-divider-color bg-background px-[14px] py-[12px] text-sm outline-none focus:border-primary"
              />
            </div>
          )}

          <button
            type="submit"
            className="primary-button mt-[8px] !rounded-[12px] !py-[12px] text-sm uppercase tracking-wide"
            disabled={isPending}
          >
            {isPending ? "Creating..." : "Create reward"}
          </button>
        </form>
      </div>
    </div>
  );
}
