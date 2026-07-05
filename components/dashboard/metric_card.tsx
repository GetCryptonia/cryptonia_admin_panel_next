"use client";

import Link from "next/link";
import { ArrowRight2 } from "iconsax-reactjs";
import type { ComponentType } from "react";

type MetricCardProps = {
  label: string;
  value: string | number;
  icon: ComponentType<{
    size?: number | string;
    color?: string;
    variant?: "Linear" | "Outline" | "Broken" | "Bold" | "Bulk" | "TwoTone";
  }>;
  iconBgClassName: string;
  iconColor: string;
  iconVariant?: "Linear" | "Outline" | "Broken" | "Bold" | "Bulk" | "TwoTone";
  href?: string;
};

export default function MetricCard({
  label,
  value,
  icon: Icon,
  iconBgClassName,
  iconColor,
  iconVariant = "Bold",
  href,
}: MetricCardProps) {
  const detailButton = (
    <span className="inline-flex items-center gap-[6px] rounded-full border border-primary px-[12px] py-[6px] text-[11px] font-semibold uppercase tracking-wide text-primary">
      View Detail
      <ArrowRight2 size={14} color="var(--primary)" />
    </span>
  );

  return (
    <div className="flex min-h-[160px] flex-col rounded-[16px] border border-divider-color bg-background p-[20px]">
      <div className="flex flex-row items-start justify-between gap-[12px]">
        <div
          className={`flex h-[44px] w-[44px] items-center justify-center rounded-full ${iconBgClassName}`}
        >
          <Icon size={22} color={iconColor} variant={iconVariant} />
        </div>

        {href ? (
          <Link href={href}>{detailButton}</Link>
        ) : (
          detailButton
        )}
      </div>

      <div className="mt-auto flex flex-col gap-[6px] pt-[24px]">
        <p className="text-sm text-hint-text-color">{label}</p>
        <p className="text-[28px] font-semibold leading-none">
          {typeof value === "number" ? value.toLocaleString() : value}
        </p>
      </div>
    </div>
  );
}
