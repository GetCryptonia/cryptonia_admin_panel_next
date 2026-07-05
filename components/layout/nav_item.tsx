"use client";

import { navTabs } from "@/lib/config/navigation";
import { navTabTitles, NavTab, NavTabType } from "@/lib/types/nav_tab";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavTabItem({
  navTab,
  onNavigate,
}: {
  navTab: NavTab;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const isActive = pathname === navTab.href;
  const Icon = navTab.icon;

  return (
    <Link
      href={navTab.href}
      onClick={onNavigate}
      className={`relative flex flex-row items-center gap-[12px] py-[12px] pl-[40px] ${isActive ? "bg-primary/10" : "bg-background"}`}
    >
      <Icon
        color={isActive ? "var(--primary)" : "var(--text-color)"}
        size={22}
        variant={isActive ? "Bold" : "Linear"}
      />

      <p
        className={`${isActive ? "text-primary font-bold" : "text-text-color font-normal"}`}
      >
        {navTab.label}
      </p>

      {isActive && (
        <div className="absolute right-0 top-0 bottom-0 w-[5px] rounded-l-[5px] bg-primary" />
      )}
    </Link>
  );
}

export function getCurrentTab(pathname: string): NavTabType | null {
  return navTabs.find((tab) => tab.href === pathname)?.key ?? null;
}

export function getPageTitle(pathname: string): string {
  const currentTab = getCurrentTab(pathname);
  return currentTab ? navTabTitles[currentTab] : "Home";
}
