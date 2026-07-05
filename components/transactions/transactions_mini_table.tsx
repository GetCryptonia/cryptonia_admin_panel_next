import type { Order } from "@/lib/features/transactions/types";
import {
  formatOrderStatus,
  formatOrderType,
  getOrderStatusClass,
} from "@/lib/features/transactions/utils";
import { formatDateTime, formatNgnAmount } from "@/lib/format";

type TransactionsMiniTableProps = {
  transactions: Order[];
  emptyMessage?: string;
};

export default function TransactionsMiniTable({
  transactions,
  emptyMessage = "No transactions found.",
}: TransactionsMiniTableProps) {
  if (transactions.length === 0) {
    return (
      <p className="text-sm text-hint-text-color">{emptyMessage}</p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-[12px] border border-divider-color bg-background">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-divider-color bg-divider-color/30">
          <tr>
            <th className="px-[16px] py-[12px] text-xs font-semibold uppercase tracking-wide text-hint-text-color">
              Type
            </th>
            <th className="px-[16px] py-[12px] text-xs font-semibold uppercase tracking-wide text-hint-text-color">
              Amount
            </th>
            <th className="px-[16px] py-[12px] text-xs font-semibold uppercase tracking-wide text-hint-text-color">
              Status
            </th>
            <th className="px-[16px] py-[12px] text-xs font-semibold uppercase tracking-wide text-hint-text-color">
              Date
            </th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr
              key={transaction._id}
              className="border-b border-divider-color last:border-b-0"
            >
              <td className="px-[16px] py-[12px]">
                {formatOrderType(transaction.type)}
              </td>
              <td className="px-[16px] py-[12px] font-medium">
                {formatNgnAmount(transaction.fiatAmount)}
              </td>
              <td className="px-[16px] py-[12px]">
                <span
                  className={`rounded-full px-[10px] py-[4px] text-xs font-semibold ${getOrderStatusClass(transaction.status)}`}
                >
                  {formatOrderStatus(transaction.status)}
                </span>
              </td>
              <td className="px-[16px] py-[12px] text-hint-text-color">
                {formatDateTime(transaction.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
