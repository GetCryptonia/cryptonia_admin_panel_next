"use client";

import CompleteTransactionModal from "@/components/transactions/complete_transaction_modal";
import TransactionDetailsPanel from "@/components/transactions/transaction_details_panel";
import CountBadge from "@/components/shared/count_badge";
import DataTableContainer, {
  TABLE_HEAD_CLASS,
  TABLE_ROW_CLASS,
  TABLE_ROW_INTERACTIVE_CLASS,
  TABLE_TD_CLASS,
  TABLE_TH_CLASS,
} from "@/components/shared/data_table";
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
import { formatDateTime, formatNgnAmount } from "@/lib/format";
import { Fragment, useEffect, useState, useTransition } from "react";

type TransactionsContentProps = {
  initialData: PaginatedTransactions;
};

export default function TransactionsContent({
  initialData,
}: TransactionsContentProps) {
  const [transactions, setTransactions] = useState(initialData.transactions);
  const [currentPage, setCurrentPage] = useState(initialData.currentPage);
  const [totalPages, setTotalPages] = useState(initialData.totalPages);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [expandedTransactionId, setExpandedTransactionId] = useState<
    string | null
  >(null);
  const [completeTarget, setCompleteTarget] = useState<Order | null>(null);
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

  return (
    <div className="flex flex-col">
      <PageHeader title="Transactions" />

      <div className="flex flex-col gap-[24px] p-[24px] md:p-[48px]">
        <PageToolbar
          meta={
            <CountBadge
              count={initialData.totalTransactions}
              label="total transactions"
            />
          }
        >
          <SearchInput
            value={searchQuery}
            onChange={(value) => {
              setSearchQuery(value);
              setCurrentPage(1);
              setExpandedTransactionId(null);
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
              <th className={TABLE_TH_CLASS}>Amount (NGN)</th>
              <th className={TABLE_TH_CLASS}>Status</th>
              <th className={TABLE_TH_CLASS}>Date</th>
              <th className={TABLE_TH_CLASS}>Order type</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => {
              const isExpanded = expandedTransactionId === transaction._id;

              return (
                <Fragment key={transaction._id}>
                  <tr
                    onClick={() =>
                      setExpandedTransactionId(
                        isExpanded ? null : transaction._id,
                      )
                    }
                    className={`${TABLE_ROW_CLASS} ${TABLE_ROW_INTERACTIVE_CLASS} ${isExpanded ? "bg-divider-color/20" : ""
                      }`}
                  >
                    <td className={TABLE_TD_CLASS}>
                      {getTransactionAccountName(transaction)}
                    </td>
                    <td className={`${TABLE_TD_CLASS} font-mono text-xs`}>
                      {transaction._id}
                    </td>
                    <td className={`${TABLE_TD_CLASS} font-medium`}>
                      {formatNgnAmount(transaction.fiatAmount)}
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
                  {isExpanded ? (
                    <tr>
                      <td colSpan={6} className="p-0">
                        <TransactionDetailsPanel
                          transaction={transaction}
                          onTransactionUpdated={handleTransactionUpdated}
                          onComplete={() => setCompleteTarget(transaction)}
                          onError={setError}
                        />
                      </td>
                    </tr>
                  ) : null}
                </Fragment>
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
          onPageChange={(page) => {
            setExpandedTransactionId(null);
            setCurrentPage(page);
          }}
          disabled={isPending}
        />
      </div>

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
