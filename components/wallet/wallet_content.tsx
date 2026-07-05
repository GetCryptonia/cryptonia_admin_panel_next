"use client";

import CountBadge from "@/components/shared/count_badge";
import DataTableContainer, {
  TABLE_HEAD_CLASS,
  TABLE_ROW_CLASS,
  TABLE_ROW_INTERACTIVE_CLASS,
  TABLE_TD_CLASS,
  TABLE_TH_CLASS,
} from "@/components/shared/data_table";
import EmptyState from "@/components/shared/empty_state";
import FilterSelect from "@/components/shared/filter_select";
import PageHeader from "@/components/shared/page_header";
import PageToolbar from "@/components/shared/page_toolbar";
import PaginationControls from "@/components/shared/pagination_controls";
import SearchInput from "@/components/shared/search_input";
import WalletDetailsPanel from "@/components/wallet/wallet_details_panel";
import { redirectIfUnauthorized } from "@/lib/api/client_action_utils";
import {
  fetchWalletDetailsAction,
  fetchWalletsAction,
  searchWalletsAction,
} from "@/lib/features/wallets/actions";
import type {
  PaginatedWallets,
  WalletDetails,
  WalletListItem,
} from "@/lib/features/wallets/types";
import {
  sortWallets,
  WALLET_SORT_OPTIONS,
  type WalletSortOption,
} from "@/lib/features/wallets/utils";
import { formatDate, formatDateTime, formatTokenAmount } from "@/lib/format";
import { Fragment, useEffect, useMemo, useState, useTransition } from "react";

type WalletContentProps = {
  initialData: PaginatedWallets;
};

export default function WalletContent({ initialData }: WalletContentProps) {
  const [wallets, setWallets] = useState(initialData.wallets);
  const [currentPage, setCurrentPage] = useState(initialData.currentPage);
  const [totalPages, setTotalPages] = useState(initialData.totalPages);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [sortBy, setSortBy] = useState<WalletSortOption>("createdAt-desc");
  const [expandedWalletId, setExpandedWalletId] = useState<string | null>(null);
  const [detailsByWalletId, setDetailsByWalletId] = useState<
    Record<string, WalletDetails>
  >({});
  const [loadingDetailsId, setLoadingDetailsId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [searchQuery]);

  useEffect(() => {
    startTransition(async () => {
      const result = debouncedQuery
        ? await searchWalletsAction(debouncedQuery, { page: currentPage })
        : await fetchWalletsAction({ page: currentPage });

      if (redirectIfUnauthorized(result)) {
        return;
      }

      if (!result.ok) {
        setError(result.message);
        return;
      }

      setWallets(result.data.wallets);
      setCurrentPage(result.data.currentPage);
      setTotalPages(result.data.totalPages);
      setError(null);
    });
  }, [debouncedQuery, currentPage]);

  const sortedWallets = useMemo(
    () => sortWallets(wallets, sortBy),
    [wallets, sortBy],
  );

  const handleToggleExpand = async (wallet: WalletListItem) => {
    if (expandedWalletId === wallet.id) {
      setExpandedWalletId(null);
      return;
    }

    setExpandedWalletId(wallet.id);

    if (detailsByWalletId[wallet.id]) {
      return;
    }

    setLoadingDetailsId(wallet.id);
    const result = await fetchWalletDetailsAction(wallet.id);

    if (redirectIfUnauthorized(result)) {
      setLoadingDetailsId(null);
      return;
    }

    if (!result.ok) {
      setError(result.message);
      setLoadingDetailsId(null);
      return;
    }

    setDetailsByWalletId((current) => ({
      ...current,
      [wallet.id]: result.data,
    }));
    setLoadingDetailsId(null);
  };

  return (
    <div className="flex flex-col">
      <PageHeader title="Wallet" />

      <div className="flex flex-col gap-[24px] p-[24px] md:p-[48px]">
        <PageToolbar
          meta={
            <CountBadge
              count={initialData.totalWallets}
              label="total wallets"
            />
          }
        >
          <SearchInput
            value={searchQuery}
            onChange={(value) => {
              setSearchQuery(value);
              setCurrentPage(1);
              setExpandedWalletId(null);
            }}
            placeholder="Search by wallet ID, user ID, or tag"
          />
          <FilterSelect
            value={sortBy}
            onChange={(value) => setSortBy(value as WalletSortOption)}
            className="min-w-[200px]"
          >
            {WALLET_SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </FilterSelect>
        </PageToolbar>

        {error ? (
          <div className="rounded-[12px] border border-primary/30 bg-primary/5 px-[16px] py-[12px] text-sm text-primary">
            {error}
          </div>
        ) : null}

        <DataTableContainer minWidth="900px">
          <thead className={TABLE_HEAD_CLASS}>
            <tr>
              <th className={TABLE_TH_CLASS}>Wallet ID</th>
              <th className={TABLE_TH_CLASS}>Balance</th>
              <th className={TABLE_TH_CLASS}>Last token traded</th>
              <th className={TABLE_TH_CLASS}>Tag</th>
              <th className={TABLE_TH_CLASS}>Last transaction</th>
              <th className={TABLE_TH_CLASS}>Created</th>
            </tr>
          </thead>
          <tbody>
            {sortedWallets.map((wallet) => {
              const isExpanded = expandedWalletId === wallet.id;

              return (
                <Fragment key={wallet.id}>
                  <tr
                    onClick={() => handleToggleExpand(wallet)}
                    className={`${TABLE_ROW_CLASS} ${TABLE_ROW_INTERACTIVE_CLASS} ${isExpanded ? "bg-divider-color/20" : ""
                      }`}
                  >
                    <td className={`${TABLE_TD_CLASS} font-mono text-xs`}>
                      {wallet.id}
                    </td>
                    <td className={`${TABLE_TD_CLASS} font-medium`}>
                      {formatTokenAmount(wallet.balance)}
                    </td>
                    <td className={TABLE_TD_CLASS}>
                      {wallet.lastTokenTraded ?? "—"}
                    </td>
                    <td className={TABLE_TD_CLASS}>{wallet.tag ?? "—"}</td>
                    <td className={`${TABLE_TD_CLASS} text-hint-text-color`}>
                      {formatDateTime(wallet.lastTransactionDate)}
                    </td>
                    <td className={`${TABLE_TD_CLASS} text-hint-text-color`}>
                      {formatDate(wallet.createdAt)}
                    </td>
                  </tr>
                  {isExpanded ? (
                    <tr>
                      <td colSpan={6} className="p-0">
                        {loadingDetailsId === wallet.id ? (
                          <div className="border-t border-divider-color px-[20px] py-[24px] text-sm text-hint-text-color">
                            Loading wallet details...
                          </div>
                        ) : detailsByWalletId[wallet.id] ? (
                          <WalletDetailsPanel
                            details={detailsByWalletId[wallet.id]}
                          />
                        ) : null}
                      </td>
                    </tr>
                  ) : null}
                </Fragment>
              );
            })}
          </tbody>
        </DataTableContainer>

        {sortedWallets.length === 0 && !isPending ? (
          <EmptyState message="No wallets found." />
        ) : null}

        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => {
            setExpandedWalletId(null);
            setCurrentPage(page);
          }}
          disabled={isPending}
        />
      </div>
    </div>
  );
}
