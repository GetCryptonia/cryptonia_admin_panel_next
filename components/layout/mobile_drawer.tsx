"use client";

import { navTabs } from "@/lib/config/navigation";
import type { NavUserDisplay } from "@/lib/features/auth/utils";
import { NavBarSection } from "@/lib/types/nav_tab";
import NavTabItem from "./nav_item";
import NavUserFooter from "./nav_user_footer";
import Image from "next/image";
import { assets } from "@/lib/utils/assets";

export default function MobileDrawer({
  onClose,
  isOpen,
  user,
}: {
  onClose: () => void;
  isOpen: boolean;
  user: NavUserDisplay;
}) {
  const sections = [null, NavBarSection.TRADE, NavBarSection.MANAGEMENT];

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-row md:hidden ${isOpen ? "block" : "hidden"}`}
    >
      <div className="flex flex-10 flex-col overflow-hidden bg-background">
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="ml-[40px] mt-[48px] mb-[36px]">
            <Image src={assets.textLogo} alt="logo" width={115} height={18} />
          </div>
          {sections.map((section) => (
            <div key={String(section)} className="flex flex-col gap-[10px]">
              <p className="text-hint-text-color py-[12px] pl-[40px]">{section}</p>
              {navTabs
                .filter((item) => item.section === section)
                .map((item) => (
                  <NavTabItem
                    key={item.key}
                    navTab={item}
                    onNavigate={onClose}
                  />
                ))}
            </div>
          ))}
        </div>
        <NavUserFooter user={user} onNavigate={onClose} />
      </div>
      <div className="flex flex-8 bg-text-color/20" onClick={onClose} />
    </div>
  );
}
