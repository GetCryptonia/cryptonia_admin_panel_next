"use client";

import CreateRewardModal from "@/components/rewards/create_reward_modal";
import DataTableContainer, {
  TABLE_HEAD_CLASS,
  TABLE_ROW_CLASS,
  TABLE_TD_CLASS,
  TABLE_TH_CLASS,
} from "@/components/shared/data_table";
import EmptyState from "@/components/shared/empty_state";
import FilterSelect from "@/components/shared/filter_select";
import PageHeader from "@/components/shared/page_header";
import StatCard from "@/components/shared/stat_card";
import { redirectIfUnauthorized } from "@/lib/api/client_action_utils";
import {
  deleteRewardAction,
  fetchRewardsAction,
} from "@/lib/features/rewards/actions";
import type { Reward, RewardsData } from "@/lib/features/rewards/types";
import { RewardStatus, RewardType } from "@/lib/features/rewards/types";
import {
  filterRewards,
  formatRewardStatus,
  formatRewardType,
  getRewardStatusClass,
  REWARD_STATUS_OPTIONS,
  REWARD_TYPE_OPTIONS,
} from "@/lib/features/rewards/utils";
import { formatDateTime } from "@/lib/format";
import { Gift, Profile2User, TickCircle, Timer1 } from "iconsax-reactjs";
import { useMemo, useState, useTransition } from "react";

type RewardsContentProps = {
  initialData: RewardsData;
};

export default function RewardsContent({ initialData }: RewardsContentProps) {
  const [rewards, setRewards] = useState(initialData.rewards);
  const [statusCounts, setStatusCounts] = useState(initialData.statuses);
  const [typeFilter, setTypeFilter] = useState<RewardType | "all">("all");
  const [statusFilter, setStatusFilter] = useState<RewardStatus | "all">("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [pendingRewardId, setPendingRewardId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const filteredRewards = useMemo(
    () => filterRewards(rewards, typeFilter, statusFilter),
    [rewards, typeFilter, statusFilter],
  );

  const refreshRewards = () => {
    startTransition(async () => {
      const result = await fetchRewardsAction();

      if (redirectIfUnauthorized(result)) {
        return;
      }

      if (!result.ok) {
        setError(result.message);
        return;
      }

      setRewards(result.data.rewards);
      setStatusCounts(result.data.statuses);
      setError(null);
    });
  };

  const handleDelete = (reward: Reward) => {
    if (!window.confirm(`Delete this ${formatRewardType(reward.type)} reward?`)) {
      return;
    }

    setPendingRewardId(reward._id);

    startTransition(async () => {
      const result = await deleteRewardAction(reward._id);

      if (redirectIfUnauthorized(result)) {
        setPendingRewardId(null);
        return;
      }

      if (!result.ok) {
        setError(result.message);
        setPendingRewardId(null);
        return;
      }

      setRewards((current) =>
        current.filter((currentReward) => currentReward._id !== reward._id),
      );
      setPendingRewardId(null);
      setError(null);
    });
  };

  return (
    <div className="flex flex-col">
      <PageHeader title="Rewards" />

      <div className="flex flex-col gap-[24px] p-[24px] md:p-[48px]">
        <div className="grid grid-cols-2 gap-[16px] md:grid-cols-4 md:gap-[20px]">
          <StatCard
            label="Total"
            value={statusCounts.total ?? rewards.length}
            icon={Gift}
            iconBgClassName="bg-[#ECE8FF]"
            iconColor="#7B61FF"
          />
          <StatCard
            label="Pending"
            value={statusCounts.PENDING ?? 0}
            icon={Timer1}
            iconBgClassName="bg-hint-text-color/10"
            iconColor="var(--hint-text-color)"
          />
          <StatCard
            label="Assigned"
            value={statusCounts.ASSIGNED ?? 0}
            icon={Profile2User}
            iconBgClassName="bg-primary/10"
            iconColor="var(--primary)"
          />
          <StatCard
            label="Claimed"
            value={statusCounts.CLAIMED ?? 0}
            icon={TickCircle}
            iconBgClassName="bg-success-color/10"
            iconColor="var(--success-color)"
          />
        </div>

        <div className="flex flex-col gap-[12px] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-row flex-wrap items-center gap-[12px]">
            <FilterSelect
              value={typeFilter}
              onChange={(value) => setTypeFilter(value as RewardType | "all")}
            >
              <option value="all">All types</option>
              {REWARD_TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </FilterSelect>

            <FilterSelect
              value={statusFilter}
              onChange={(value) =>
                setStatusFilter(value as RewardStatus | "all")
              }
            >
              <option value="all">All statuses</option>
              {REWARD_STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </FilterSelect>
          </div>

          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="primary-button self-start !rounded-[10px] !px-[16px] !py-[10px] text-xs uppercase tracking-wide"
          >
            Create reward
          </button>
        </div>

        {error ? (
          <div className="rounded-[12px] border border-primary/30 bg-primary/5 px-[16px] py-[12px] text-sm text-primary">
            {error}
          </div>
        ) : null}

        <DataTableContainer minWidth="900px">
          <thead className={TABLE_HEAD_CLASS}>
            <tr>
              <th className={TABLE_TH_CLASS}>Type</th>
              <th className={TABLE_TH_CLASS}>Status</th>
              <th className={TABLE_TH_CLASS}>Amount</th>
              <th className={TABLE_TH_CLASS}>User ID</th>
              <th className={TABLE_TH_CLASS}>Created</th>
              <th className={TABLE_TH_CLASS}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRewards.map((reward) => (
              <tr key={reward._id} className={TABLE_ROW_CLASS}>
                <td className={TABLE_TD_CLASS}>
                  {formatRewardType(reward.type)}
                </td>
                <td className={TABLE_TD_CLASS}>
                  <span
                    className={`rounded-full px-[10px] py-[4px] text-xs font-semibold ${getRewardStatusClass(reward.status)}`}
                  >
                    {formatRewardStatus(reward.status)}
                  </span>
                </td>
                <td className={TABLE_TD_CLASS}>{reward.amount ?? "—"}</td>
                <td className={`${TABLE_TD_CLASS} font-mono text-xs`}>
                  {reward.userId ?? "—"}
                </td>
                <td className={`${TABLE_TD_CLASS} text-hint-text-color`}>
                  {formatDateTime(reward.createdAt)}
                </td>
                <td className={TABLE_TD_CLASS}>
                  <button
                    type="button"
                    onClick={() => handleDelete(reward)}
                    disabled={isPending && pendingRewardId === reward._id}
                    className="rounded-[10px] border border-divider-color px-[14px] py-[8px] text-xs font-semibold uppercase tracking-wide text-primary transition-colors hover:border-primary/30"
                  >
                    {isPending && pendingRewardId === reward._id
                      ? "Deleting..."
                      : "Delete"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </DataTableContainer>

        {filteredRewards.length === 0 && !isPending ? (
          <EmptyState message="No rewards found." />
        ) : null}
      </div>

      {showCreateModal ? (
        <CreateRewardModal
          onClose={() => setShowCreateModal(false)}
          onCreated={refreshRewards}
          onError={setError}
        />
      ) : null}
    </div>
  );
}
