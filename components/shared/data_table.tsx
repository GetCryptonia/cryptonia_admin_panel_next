"use client";

export const TABLE_HEAD_CLASS =
  "border-b border-divider-color bg-divider-color/30";

export const TABLE_TH_CLASS =
  "px-[16px] py-[12px] text-xs font-semibold uppercase tracking-wide text-hint-text-color";

export const TABLE_TD_CLASS = "px-[16px] py-[12px]";

export const TABLE_ROW_CLASS =
  "border-b border-divider-color transition-colors last:border-b-0";

export const TABLE_ROW_INTERACTIVE_CLASS =
  "cursor-pointer hover:bg-divider-color/30";

type DataTableContainerProps = {
  children: React.ReactNode;
  minWidth?: string;
};

export default function DataTableContainer({
  children,
  minWidth = "900px",
}: DataTableContainerProps) {
  return (
    <div className="overflow-x-auto rounded-[16px] border border-divider-color bg-background shadow-[0_8px_24px_rgba(12,12,12,0.04)]">
      <table className="w-full text-left text-sm" style={{ minWidth }}>
        {children}
      </table>
    </div>
  );
}
