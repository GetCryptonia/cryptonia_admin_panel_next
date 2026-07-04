import type { ComponentType } from "react";

export enum NavBarSection {
  TRADE = "Trade",
  MANAGEMENT = "Management",
}

export enum NavTabType {
  DASHBOARD = "dashboard",
  BALANCE = "balance",
  SETUP = "setup",
  CUSTOMERS = "customers",
  TRANSACTIONS = "transactions",
  WALLET = "wallet",
  MEMBERS = "members",
}

export const navTabTitles: Record<NavTabType, string> = {
  [NavTabType.DASHBOARD]: "Dashboard",
  [NavTabType.BALANCE]: "Balance",
  [NavTabType.SETUP]: "Setup",
  [NavTabType.CUSTOMERS]: "Customers",
  [NavTabType.TRANSACTIONS]: "Transactions",
  [NavTabType.WALLET]: "Wallet",
  [NavTabType.MEMBERS]: "Members",
};

export interface NavTab {
  label: string;
  href: string;
  icon: ComponentType<{
    size?: number;
    color?: string;
    variant?: "Bold" | "Linear";
  }>;
  section: NavBarSection | null;
  key: NavTabType;
}
