import type { PaginatedResponse } from "@/lib/api/types";
import type { Order } from "@/lib/features/transactions/types";

export type Customer = {
  id: string;
  username: string;
  email: string;
  emailVerified: boolean;
  avatar?: string | null;
  referralCode: string | null;
  firstName: string | null;
  middleName: string | null;
  lastName: string | null;
  dateOfBirth: string | null;
  phone: string | null;
  kyc: string | null;
  active: boolean;
  role: string;
  currency: string;
  lastLogin: string | null;
  createdAt?: string | null;
};

export type PaginatedCustomers = PaginatedResponse<
  Customer,
  "customers",
  "totalCustomers"
>;

export type BankAccount = {
  _id?: string;
  userId: string;
  bankCode: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  categoryId: string;
  createdAt?: string;
  updatedAt?: string;
};

export type VerificationStatus =
  | "NotStarted"
  | "Pending"
  | "Completed"
  | "Failed";

export type KycTierInfo = {
  tier: number;
  verified: boolean;
  key: "EMAIL" | "BVN" | "NIN" | "ADDRESS";
  verificationStatus: VerificationStatus;
  title: string;
  introMessage: string;
  benefits: string[];
  transactionAmount: number;
  requirement: string;
  fiatDepositLimit: number;
  fiatWithdrawalLimit: number;
  fiatDailyWithdrawalLimit: number;
  stablecoinWithdrawalLimit: number;
  accountBalance: string;
};

export type UserKycStatus = {
  tier: number;
  minKycTier: number;
  kycInfo: KycTierInfo[];
};

export type CustomerBook = {
  balance: number;
  expectedBalance: number;
  inflow: number;
  outflow: number;
  processing: number;
};

export type CustomerDetails = {
  book: CustomerBook;
  kycStatus: UserKycStatus;
  bankAccounts: BankAccount[];
  recentTransactions: Order[];
};
