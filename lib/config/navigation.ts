import {
  Buildings,
  Gift,
  Home,
  Layer,
  MoneyTime,
  PasswordCheck,
  People,
  Wallet3,
} from "iconsax-reactjs";
import { NavTab, NavTabType } from "../types/nav_tab";
import { NavBarSection } from "../types/nav_tab";

export const navTabs: NavTab[] = [
  //null sections
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: Home,
    section: null,
    key: NavTabType.DASHBOARD,
  },
  {
    label: "Balance",
    href: "/balance",
    icon: PasswordCheck,
    section: null,
    key: NavTabType.BALANCE,
  },
  {
    label: "Setup",
    href: "/setup",
    icon: Layer,
    section: null,
    key: NavTabType.SETUP,
  },
  {
    label: "Rewards",
    href: "/rewards",
    icon: Gift,
    section: null,
    key: NavTabType.REWARDS,
  },

  //trade sections
  {
    label: "Customers",
    href: "/customers",
    icon: People,
    section: NavBarSection.TRADE,
    key: NavTabType.CUSTOMERS,
  },
  {
    label: "Transactions",
    href: "/transactions",
    icon: MoneyTime,
    section: NavBarSection.TRADE,
    key: NavTabType.TRANSACTIONS,
  },
  {
    label: "Wallet",
    href: "/wallet",
    icon: Wallet3,
    section: NavBarSection.TRADE,
    key: NavTabType.WALLET,
  },

  //management sections
  {
    label: "Members",
    href: "/members",
    icon: Buildings,
    section: NavBarSection.MANAGEMENT,
    key: NavTabType.MEMBERS,
  },
];
