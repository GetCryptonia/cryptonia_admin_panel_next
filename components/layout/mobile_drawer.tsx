"use client";

import { NavBarSection } from "@/lib/types/nav_tab";
import Image from "next/image";
import { assets } from "@/lib/utils/assets";
import NavTabItem from "./nav_item";
import { navTabs } from "@/lib/config/navigation";

export default function MobileDrawer({
  onClose,
  isOpen,
}: {
  onClose: () => void;
  isOpen: boolean;
}) {
  const sections = [null, NavBarSection.TRADE, NavBarSection.MANAGEMENT];

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-row md:hidden ${isOpen ? "block" : "hidden"}`}
    >
      <div className="bg-background flex flex-10 flex-col overflow-y-auto">
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
      <div className="bg-text-color/20 flex flex-8" onClick={onClose} />
    </div>
  );
}
