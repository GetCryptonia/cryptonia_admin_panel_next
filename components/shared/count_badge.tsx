"use client";

type CountBadgeProps = {
  count: number;
  label: string;
};

export default function CountBadge({ count, label }: CountBadgeProps) {
  return (
    <span className="inline-flex items-center rounded-[10px] border border-primary/25 bg-primary/5 px-[14px] py-[8px] text-sm">
      <span className="font-semibold text-primary">
        {count.toLocaleString("en-GB")}
      </span>
      <span className="ml-[6px] text-hint-text-color">{label}</span>
    </span>
  );
}
