"use client";

import type { ComponentType } from "react";

type StatCardProps = {
  label: string;
  value: string | number;
  icon?: ComponentType<{
    size?: number | string;
    color?: string;
    variant?: "Linear" | "Outline" | "Broken" | "Bold" | "Bulk" | "TwoTone";
  }>;
  iconBgClassName?: string;
  iconColor?: string;
  compact?: boolean;
};

export default function StatCard({
  label,
  value,
  icon: Icon,
  iconBgClassName,
  iconColor,
  compact = false,
}: StatCardProps) {
  return (
    <div
      className={`flex flex-col rounded-[16px] border border-divider-color bg-background shadow-[0_8px_24px_rgba(12,12,12,0.04)] ${
        compact ? "p-[16px]" : "p-[20px]"
      }`}
    >
      {Icon && iconBgClassName ? (
        <div
          className={`flex items-center justify-center rounded-full ${iconBgClassName} ${
            compact ? "h-[36px] w-[36px]" : "h-[40px] w-[40px]"
          }`}
        >
          <Icon size={compact ? 18 : 20} color={iconColor} variant="Bulk" />
        </div>
      ) : null}

      <div
        className={`flex flex-col gap-[4px] ${Icon ? (compact ? "mt-[12px]" : "mt-[16px]") : ""}`}
      >
        <p className="text-xs font-semibold uppercase tracking-wide text-hint-text-color">
          {label}
        </p>
        <p
          className={`font-semibold leading-none ${
            compact ? "text-[18px]" : "text-[24px]"
          }`}
        >
          {typeof value === "number" ? value.toLocaleString("en-GB") : value}
        </p>
      </div>
    </div>
  );
}
