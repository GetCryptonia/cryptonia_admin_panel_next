'use client';
import { NavTab, NavTabType } from "@/lib/types/nav_tab";


export default function NavTabItem({
    navTab,
    isActive,
    onTabClick
}: {
    navTab: NavTab,
    isActive: boolean,
    onTabClick: (tab: NavTabType) => void
}) {
    const Icon = navTab.icon;
    return (
        <div className={`relative flex flex-row items-center gap-[12px] py-[12px] pl-[40px] cursor-pointer ${isActive ? 'bg-primary/10' : 'background'}`} onClick={() => onTabClick(navTab.key)}>

            <Icon color={isActive ? 'var(--primary)' : 'var(--text-color)'} size={22} variant={isActive ? 'Bold' : 'Linear'} />

            <p className={`${isActive ? 'text-primary' : 'text-text-color'} ${isActive ? 'font-bold' : 'font-normal'}`}>
                {navTab.label}
            </p>

            {isActive && (
                <div className="absolute right-0 top-0 bottom-0 w-[5px] rounded-l-[5px] bg-primary" />
            )}
        </div>
    );
}