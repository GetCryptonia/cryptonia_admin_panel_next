"use client";

import DesktopSidebar from "./desktop_sidebar";
import MobileDrawer from "./mobile_drawer";
import { getPageTitle } from "./nav_item";
import { useState } from "react";
import { HamburgerMenu } from "iconsax-reactjs";
import { usePathname } from "next/navigation";

export default function AppNav() {
  const pathname = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <>
      <div className="w-full md:hidden">
        <div className="flex h-[60px] w-full flex-row items-center p-[20px]">
          <HamburgerMenu
            size={24}
            color="var(--text-color)"
            onClick={() => setIsDrawerOpen(true)}
          />
          <h1 className="ml-[16px] text-2xl font-bold">{getPageTitle(pathname)}</h1>
        </div>
        <div className="h-[1px] w-full bg-divider-color" />
      </div>
      <MobileDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
      <DesktopSidebar />
    </>
  );
}
