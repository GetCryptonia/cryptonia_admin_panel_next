"use client";
import { navTabs } from "@/lib/config/navigation";
import { NavBarSection, NavTab, NavTabType } from "@/lib/types/nav_tab";
import NavTabItem from "./nav_item";
import Image from "next/image";
import { assets } from "@/lib/utils/assets";


export default function DesktopSidebar({ currentTab, onTabClick }: { currentTab: NavTabType, onTabClick: (tab: NavTabType) => void }) {

    const sections = [null, NavBarSection.TRADE, NavBarSection.MANAGEMENT];
    return (
        <div className="max-w-[250px] w-full flex flex-row h-screen hidden md:flex">
            <div className="flex flex-col flex-1">
                <div className="ml-[40px] mt-[48px] mb-[36px]">
                    <Image src={assets.textLogo} alt="logo" width={115} height={18} />
                </div>
                {sections.map((section) => (
                    <div key={section} className="flex flex-col gap-[10px]">
                        <p className="text-hint-text-color py-[12px] pl-[40px]">{section}</p>
                        {navTabs.filter((item) => item.section === section).map((item) => (
                            <NavTabItem key={item.key} navTab={item} isActive={item.key === currentTab} onTabClick={onTabClick} />
                        ))}
                    </div>
                ))}
            </div>
            <div className="bg-divider-color w-[1px] h-full">
            </div>
        </div>
    );
}