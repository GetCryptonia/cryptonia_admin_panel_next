"use client";
import { navTabTitles, NavTabType } from "@/lib/types/nav_tab";
import DesktopSidebar from "./desktop_sidebar";
import MobileDrawer from "./mobile_drawer";
import { useState } from "react";
import { HamburgerMenu } from "iconsax-reactjs";


export default function AppNav() {
    const [currentTab, setCurrentTab] = useState<NavTabType>(NavTabType.DASHBOARD);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    return (
        <div>
            <div className="flex flex-col">
                <div className="w-screen h-[60px] flex flex-1 flex-row items-center p-[20px] block md:hidden">
                    <HamburgerMenu size={24} color="var(--text-color)" onClick={() => setIsDrawerOpen(true)} />
                    <h1 className="text-2xl font-bold ml-[16px]">{navTabTitles[currentTab]}</h1>
                </div>
                <div className="h-[1px] w-full bg-divider-color"></div>
            </div>
            <MobileDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                currentTab={currentTab} onTabClick={(tab) => {
                    setCurrentTab(tab);
                    setIsDrawerOpen(false);
                }} />
            <DesktopSidebar currentTab={currentTab} onTabClick={setCurrentTab} />
        </div>
    );
}