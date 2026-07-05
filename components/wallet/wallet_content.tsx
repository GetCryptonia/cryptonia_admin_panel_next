"use client";

import CountBadge from "@/components/shared/count_badge";
import DataTableContainer, {
  TABLE_HEAD_CLASS,
  TABLE_ROW_CLASS,
  TABLE_ROW_INTERACTIVE_CLASS,
  TABLE_TD_CLASS,
  TABLE_TH_CLASS,
} from "@/components/shared/data_table";
import DetailDrawer from "@/components/shared/detail_drawer";
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
import { formatDate, formatDateTime, formatUsdTokenAmount } from "@/lib/format";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";

type WalletContentProps = {
  initialData: PaginatedWallets;
};

export default function WalletContent({ initialData }: WalletContentProps) {
  const [wallets, setWallets] = useState(initialData.wallets);
  const [totalWallets, setTotalWallets] = useState(initialData.totalWallets);
  const [currentPage, setCurrentPage] = useState(initialData.currentPage);
  const [totalPages, setTotalPages] = useState(initialData.totalPages);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [sortBy, setSortBy] = useState<WalletSortOption>("createdAt-desc");
  const [selectedWalletId, setSelectedWalletId] = useState<string | null>(null);
  const [detailsByWalletId, setDetailsByWalletId] = useState<
    Record<string, WalletDetails>
  >({});
  const [loadingDetailsId, setLoadingDetailsId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const skipInitialFetchRef = useRef(true);

  const selectedWallet = wallets.find((wallet) => wallet.id === selectedWalletId);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [searchQuery]);

  useEffect(() => {
    if (skipInitialFetchRef.current) {
      skipInitialFetchRef.current = false;
      return;
    }

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
      setTotalWallets(result.data.totalWallets);
      setCurrentPage(result.data.currentPage);
      setTotalPages(result.data.totalPages);
      setError(null);
    });
  }, [debouncedQuery, currentPage]);

  const sortedWallets = useMemo(
    () => sortWallets(wallets, sortBy),
    [wallets, sortBy],
  );

  const handleOpenWallet = async (wallet: WalletListItem) => {
    setSelectedWalletId(wallet.id);
    setError(null);

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

  const handleCloseDrawer = () => {
    setSelectedWalletId(null);
  };

  const handlePageChange = (page: number) => {
    setSelectedWalletId(null);
    setCurrentPage(page);
  };

  return (
    <div className="flex flex-col">
      <PageHeader title="Wallet" />

      <div className="flex flex-col gap-[24px] p-[24px] md:p-[48px]">
        <PageToolbar
          meta={<CountBadge count={totalWallets} label="total wallets" />}
        >
          <SearchInput
            value={searchQuery}
            onChange={(value) => {
              setSearchQuery(value);
              setCurrentPage(1);
              setSelectedWalletId(null);
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
              const isSelected = selectedWalletId === wallet.id;

              return (
                <tr
                  key={wallet.id}
                  onClick={() => handleOpenWallet(wallet)}
                  className={`${TABLE_ROW_CLASS} ${TABLE_ROW_INTERACTIVE_CLASS} ${
                    isSelected ? "bg-divider-color/30" : ""
                  }`}
                >
                  <td className={`${TABLE_TD_CLASS} font-mono text-xs`}>
                    {wallet.id}
                  </td>
                  <td className={`${TABLE_TD_CLASS} font-medium`}>
                    {formatUsdTokenAmount(wallet.balance)}
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
          onPageChange={handlePageChange}
          disabled={isPending}
        />
      </div>

      <DetailDrawer
        isOpen={selectedWalletId !== null}
        onClose={handleCloseDrawer}
        title={
          selectedWallet?.tag
            ? `@${selectedWallet.tag}`
            : selectedWallet
              ? `Wallet ${selectedWallet.id.slice(0, 8)}…`
              : "Wallet details"
        }
        headerMeta={
          selectedWallet ? (
            <span className="rounded-full bg-[#ECE8FF] px-[12px] py-[4px] text-xs font-semibold text-[#7B61FF]">
              {formatUsdTokenAmount(selectedWallet.balance)}
            </span>
          ) : null
        }
      >
        {selectedWalletId && loadingDetailsId === selectedWalletId ? (
          <div className="px-[24px] py-[32px] text-sm text-hint-text-color">
            Loading wallet details...
          </div>
        ) : selectedWalletId && detailsByWalletId[selectedWalletId] ? (
          <WalletDetailsPanel details={detailsByWalletId[selectedWalletId]} />
        ) : null}
      </DetailDrawer>
    </div>
  );
}
