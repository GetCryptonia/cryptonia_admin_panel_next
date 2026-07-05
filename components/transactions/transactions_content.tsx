"use client";

import CompleteTransactionModal from "@/components/transactions/complete_transaction_modal";
import TransactionDetailsPanel, {
  TransactionDetailsFooterActions,
} from "@/components/transactions/transaction_details_panel";
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
import PageHeader from "@/components/shared/page_header";
import PageToolbar from "@/components/shared/page_toolbar";
import PaginationControls from "@/components/shared/pagination_controls";
import SearchInput from "@/components/shared/search_input";
import { redirectIfUnauthorized } from "@/lib/api/client_action_utils";
import {
  fetchTransactionsAction,
  searchTransactionsAction,
} from "@/lib/features/transactions/actions";
import type { Order, PaginatedTransactions } from "@/lib/features/transactions/types";
import {
  formatOrderStatus,
  formatOrderType,
  getOrderStatusClass,
  getTransactionAccountName,
} from "@/lib/features/transactions/utils";
import { formatDateTime, formatUsdTokenAmount } from "@/lib/format";
import { useEffect, useRef, useState, useTransition } from "react";

type TransactionsContentProps = {
  initialData: PaginatedTransactions;
};

export default function TransactionsContent({
  initialData,
}: TransactionsContentProps) {
  const [transactions, setTransactions] = useState(initialData.transactions);
  const [totalTransactions, setTotalTransactions] = useState(
    initialData.totalTransactions,
  );
  const [currentPage, setCurrentPage] = useState(initialData.currentPage);
  const [totalPages, setTotalPages] = useState(initialData.totalPages);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedTransactionId, setSelectedTransactionId] = useState<
    string | null
  >(null);
  const [completeTarget, setCompleteTarget] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const skipInitialFetchRef = useRef(true);

  const selectedTransaction = transactions.find(
    (transaction) => transaction._id === selectedTransactionId,
  );

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
        ? await searchTransactionsAction(debouncedQuery, { page: currentPage })
        : await fetchTransactionsAction({ page: currentPage });

      if (redirectIfUnauthorized(result)) {
        return;
      }

      if (!result.ok) {
        setError(result.message);
        return;
      }

      setTransactions(result.data.transactions);
      setTotalTransactions(result.data.totalTransactions);
      setCurrentPage(result.data.currentPage);
      setTotalPages(result.data.totalPages);
      setError(null);
    });
  }, [debouncedQuery, currentPage]);

  const handleTransactionUpdated = (updatedOrder: Order) => {
    setTransactions((current) =>
      current.map((transaction) =>
        transaction._id === updatedOrder._id ? updatedOrder : transaction,
      ),
    );
  };

  const handleCloseDrawer = () => {
    setSelectedTransactionId(null);
  };

  const handlePageChange = (page: number) => {
    setSelectedTransactionId(null);
    setCurrentPage(page);
  };

  return (
    <div className="flex flex-col">
      <PageHeader title="Transactions" />

      <div className="flex flex-col gap-[24px] p-[24px] md:p-[48px]">
        <PageToolbar
          meta={
            <CountBadge count={totalTransactions} label="total transactions" />
          }
        >
          <SearchInput
            value={searchQuery}
            onChange={(value) => {
              setSearchQuery(value);
              setCurrentPage(1);
              setSelectedTransactionId(null);
            }}
            placeholder="Search by transaction ID, session ID, or hash"
          />
        </PageToolbar>

        {error ? (
          <div className="rounded-[12px] border border-primary/30 bg-primary/5 px-[16px] py-[12px] text-sm text-primary">
            {error}
          </div>
        ) : null}

        <DataTableContainer minWidth="1000px">
          <thead className={TABLE_HEAD_CLASS}>
            <tr>
              <th className={TABLE_TH_CLASS}>Account name</th>
              <th className={TABLE_TH_CLASS}>Transaction ID</th>
              <th className={TABLE_TH_CLASS}>Amount</th>
              <th className={TABLE_TH_CLASS}>Status</th>
              <th className={TABLE_TH_CLASS}>Date</th>
              <th className={TABLE_TH_CLASS}>Order type</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => {
              const isSelected = selectedTransactionId === transaction._id;

              return (
                <tr
                  key={transaction._id}
                  onClick={() => setSelectedTransactionId(transaction._id)}
                  className={`${TABLE_ROW_CLASS} ${TABLE_ROW_INTERACTIVE_CLASS} ${
                    isSelected ? "bg-divider-color/30" : ""
                  }`}
                >
                  <td className={TABLE_TD_CLASS}>
                    {getTransactionAccountName(transaction)}
                  </td>
                  <td className={`${TABLE_TD_CLASS} font-mono text-xs`}>
                    {transaction._id}
                  </td>
                  <td className={`${TABLE_TD_CLASS} font-medium`}>
                    {formatUsdTokenAmount(transaction.tokenAmount)}
                  </td>
                  <td className={TABLE_TD_CLASS}>
                    <span
                      className={`rounded-full px-[10px] py-[4px] text-xs font-semibold ${getOrderStatusClass(transaction.status)}`}
                    >
                      {formatOrderStatus(transaction.status)}
                    </span>
                  </td>
                  <td className={`${TABLE_TD_CLASS} text-hint-text-color`}>
                    {formatDateTime(transaction.createdAt)}
                  </td>
                  <td className={TABLE_TD_CLASS}>
                    {formatOrderType(transaction.type)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </DataTableContainer>

        {transactions.length === 0 && !isPending ? (
          <EmptyState message="No transactions found." />
        ) : null}

        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          disabled={isPending}
        />
      </div>

      <DetailDrawer
        isOpen={selectedTransactionId !== null}
        onClose={handleCloseDrawer}
        title={
          selectedTransaction
            ? getTransactionAccountName(selectedTransaction)
            : "Transaction details"
        }
        headerMeta={
          selectedTransaction ? (
            <span
              className={`rounded-full px-[12px] py-[4px] text-xs font-semibold ${getOrderStatusClass(selectedTransaction.status)}`}
            >
              {formatOrderStatus(selectedTransaction.status)}
            </span>
          ) : null
        }
        footer={
          selectedTransaction ? (
            <TransactionDetailsFooterActions
              transaction={selectedTransaction}
              onComplete={() => setCompleteTarget(selectedTransaction)}
              onTransactionUpdated={handleTransactionUpdated}
              onError={setError}
            />
          ) : null
        }
      >
        {selectedTransaction ? (
          <TransactionDetailsPanel transaction={selectedTransaction} />
        ) : null}
      </DetailDrawer>

      {completeTarget ? (
        <CompleteTransactionModal
          transaction={completeTarget}
          onClose={() => setCompleteTarget(null)}
          onCompleted={handleTransactionUpdated}
          onError={setError}
        />
      ) : null}
    </div>
  );
}
