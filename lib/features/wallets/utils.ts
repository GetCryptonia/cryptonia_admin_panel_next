import type { WalletListItem } from "./types";

export type WalletSortOption =
  | "createdAt-desc"
  | "createdAt-asc"
  | "balance-desc"
  | "balance-asc"
  | "lastTransactionDate-desc"
  | "lastTransactionDate-asc";

export const WALLET_SORT_OPTIONS: {
  value: WalletSortOption;
  label: string;
}[] = [
  { value: "createdAt-desc", label: "Date created (newest)" },
  { value: "createdAt-asc", label: "Date created (oldest)" },
  { value: "balance-desc", label: "Balance (high to low)" },
  { value: "balance-asc", label: "Balance (low to high)" },
  { value: "lastTransactionDate-desc", label: "Last transaction (newest)" },
  { value: "lastTransactionDate-asc", label: "Last transaction (oldest)" },
];

function compareNullableDates(
  left: string | null,
  right: string | null,
  direction: "asc" | "desc",
): number {
  if (!left && !right) {
    return 0;
  }

  if (!left) {
    return direction === "asc" ? -1 : 1;
  }

  if (!right) {
    return direction === "asc" ? 1 : -1;
  }

  const leftTime = new Date(left).getTime();
  const rightTime = new Date(right).getTime();
  return direction === "asc" ? leftTime - rightTime : rightTime - leftTime;
}

export function sortWallets(
  wallets: WalletListItem[],
  sortBy: WalletSortOption,
): WalletListItem[] {
  const sorted = [...wallets];

  sorted.sort((left, right) => {
    switch (sortBy) {
      case "createdAt-asc":
        return compareNullableDates(left.createdAt, right.createdAt, "asc");
      case "createdAt-desc":
        return compareNullableDates(left.createdAt, right.createdAt, "desc");
      case "balance-asc":
        return left.balance - right.balance;
      case "balance-desc":
        return right.balance - left.balance;
      case "lastTransactionDate-asc":
        return compareNullableDates(
          left.lastTransactionDate,
          right.lastTransactionDate,
          "asc",
        );
      case "lastTransactionDate-desc":
        return compareNullableDates(
          left.lastTransactionDate,
          right.lastTransactionDate,
          "desc",
        );
      default:
        return 0;
    }
  });

  return sorted;
}
