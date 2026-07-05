"use client";

import CountBadge from "@/components/shared/count_badge";
import DataTableContainer, {
  TABLE_HEAD_CLASS,
  TABLE_ROW_CLASS,
  TABLE_TD_CLASS,
  TABLE_TH_CLASS,
} from "@/components/shared/data_table";
import EmptyState from "@/components/shared/empty_state";
import FilterSelect from "@/components/shared/filter_select";
import PageHeader from "@/components/shared/page_header";
import PageToolbar from "@/components/shared/page_toolbar";
import PaginationControls from "@/components/shared/pagination_controls";
import { redirectIfUnauthorized } from "@/lib/api/client_action_utils";
import type { BackOfficeRole } from "@/lib/features/auth/types";
import {
  changeMemberRoleAction,
  fetchMembersAction,
  removeMemberAction,
} from "@/lib/features/members/actions";
import type { Member, PaginatedMembers } from "@/lib/features/members/types";
import { formatMemberRole, MEMBER_ROLE_OPTIONS } from "@/lib/features/members/utils";
import { useEffect, useState, useTransition } from "react";

type MembersContentProps = {
  initialData: PaginatedMembers;
};

export default function MembersContent({ initialData }: MembersContentProps) {
  const [members, setMembers] = useState(initialData.members);
  const [currentPage, setCurrentPage] = useState(initialData.currentPage);
  const [totalPages, setTotalPages] = useState(initialData.totalPages);
  const [error, setError] = useState<string | null>(null);
  const [pendingMemberId, setPendingMemberId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const result = await fetchMembersAction({ page: currentPage });

      if (redirectIfUnauthorized(result)) {
        return;
      }

      if (!result.ok) {
        setError(result.message);
        return;
      }

      setMembers(result.data.members);
      setCurrentPage(result.data.currentPage);
      setTotalPages(result.data.totalPages);
      setError(null);
    });
  }, [currentPage]);

  const handleRoleChange = (memberId: string, role: BackOfficeRole) => {
    setPendingMemberId(memberId);

    startTransition(async () => {
      const result = await changeMemberRoleAction(memberId, { role });

      if (redirectIfUnauthorized(result)) {
        setPendingMemberId(null);
        return;
      }

      if (!result.ok) {
        setError(result.message);
        setPendingMemberId(null);
        return;
      }

      setMembers((current) =>
        current.map((member) =>
          member.id === memberId ? result.data : member,
        ),
      );
      setPendingMemberId(null);
      setError(null);
    });
  };

  const handleRemove = (member: Member) => {
    if (
      !window.confirm(
        `Remove ${member.username} from the admin panel? This action cannot be undone.`,
      )
    ) {
      return;
    }

    setPendingMemberId(member.id);

    startTransition(async () => {
      const result = await removeMemberAction(member.id);

      if (redirectIfUnauthorized(result)) {
        setPendingMemberId(null);
        return;
      }

      if (!result.ok) {
        setError(result.message);
        setPendingMemberId(null);
        return;
      }

      setMembers((current) =>
        current.filter((currentMember) => currentMember.id !== member.id),
      );
      setPendingMemberId(null);
      setError(null);
    });
  };

  return (
    <div className="flex flex-col">
      <PageHeader title="Members" />

      <div className="flex flex-col gap-[24px] p-[24px] md:p-[48px]">
        <PageToolbar
          meta={
            <CountBadge
              count={initialData.totalMembers}
              label="admin panel members"
            />
          }
        />

        {error ? (
          <div className="rounded-[12px] border border-primary/30 bg-primary/5 px-[16px] py-[12px] text-sm text-primary">
            {error}
          </div>
        ) : null}

        <DataTableContainer minWidth="720px">
          <thead className={TABLE_HEAD_CLASS}>
            <tr>
              <th className={TABLE_TH_CLASS}>Username</th>
              <th className={TABLE_TH_CLASS}>Email</th>
              <th className={TABLE_TH_CLASS}>Role</th>
              <th className={TABLE_TH_CLASS}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => {
              const isRowPending = pendingMemberId === member.id;

              return (
                <tr key={member.id} className={TABLE_ROW_CLASS}>
                  <td className={`${TABLE_TD_CLASS} font-medium`}>
                    {member.username}
                  </td>
                  <td className={TABLE_TD_CLASS}>{member.email}</td>
                  <td className={TABLE_TD_CLASS}>
                    <FilterSelect
                      value={member.role}
                      onChange={(value) =>
                        handleRoleChange(member.id, value as BackOfficeRole)
                      }
                      disabled={isPending && isRowPending}
                      className="min-w-[160px]"
                    >
                      {MEMBER_ROLE_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </FilterSelect>
                    <p className="mt-[6px] text-xs text-hint-text-color">
                      Current: {formatMemberRole(member.role)}
                    </p>
                  </td>
                  <td className={TABLE_TD_CLASS}>
                    <button
                      type="button"
                      onClick={() => handleRemove(member)}
                      disabled={isPending && isRowPending}
                      className="rounded-[10px] border border-divider-color px-[14px] py-[8px] text-xs font-semibold uppercase tracking-wide text-primary transition-colors hover:border-primary/30"
                    >
                      {isPending && isRowPending ? "Removing..." : "Remove"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </DataTableContainer>

        {members.length === 0 && !isPending ? (
          <EmptyState message="No members found." />
        ) : null}

        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          disabled={isPending}
        />
      </div>
    </div>
  );
}
