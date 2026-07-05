import type { PaginatedResponse } from "@/lib/api/types";
import type { Order } from "@/lib/features/transactions/types";

export type WalletListItem = {
  id: string;
  userId: string;
  balance: number;
  lastTokenTraded: string | null;
  tag: string | null;
  lastTransactionDate: string | null;
  createdAt: string;
};

export type WalletUser = {
  id: string;
  username: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
};

export type PaginatedWallets = PaginatedResponse<
  WalletListItem,
  "wallets",
  "totalWallets"
>;

export type WalletDetails = {
  wallet: WalletListItem;
  user: WalletUser;
  recentTransactions: Order[];
  totalInflow: number;
  totalOutflow: number;
};
