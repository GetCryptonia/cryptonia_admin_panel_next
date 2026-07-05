"use client";

import BrandLogo from "@/components/logos/brand_logo";
import { navTabs } from "@/lib/config/navigation";
import type { NavUserDisplay } from "@/lib/features/auth/utils";
import { NavBarSection } from "@/lib/types/nav_tab";
import NavTabItem from "./nav_item";
import NavUserFooter from "./nav_user_footer";

type DesktopSidebarProps = {
  user: NavUserDisplay;
};

export default function DesktopSidebar({ user }: DesktopSidebarProps) {
  const sections = [null, NavBarSection.TRADE, NavBarSection.MANAGEMENT];

  return (
    <div className="hidden h-full w-full max-w-[250px] shrink-0 flex-row md:flex">
      <div className="flex h-full flex-1 flex-col">
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="ml-[40px] mt-[48px] mb-[36px]">
            <BrandLogo variant="text" />
          </div>
          {sections.map((section) => (
            <div key={String(section)} className="flex flex-col gap-[10px]">
              <p className="text-hint-text-color py-[12px] pl-[40px]">{section}</p>
              {navTabs
                .filter((item) => item.section === section)
                .map((item) => (
                  <NavTabItem key={item.key} navTab={item} />
                ))}
            </div>
          ))}
        </div>
        <NavUserFooter user={user} />
      </div>
      <div className="h-full w-[1px] bg-divider-color" />
    </div>
  );
}
