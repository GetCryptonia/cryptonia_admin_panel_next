"use client";

import DashboardDatePicker from "@/components/dashboard/dashboard_date_picker";
import { formatDisplayDate } from "@/lib/features/dashboard/date_range";
import { Filter, NoteText } from "iconsax-reactjs";
import type { DateRangeParams } from "@/lib/api/types";
import type { DateRangePreset } from "@/lib/features/dashboard/date_range";

type DashboardTopBarProps = {
  title: string;
  startDate: string;
  endDate: string;
  isDatePickerOpen: boolean;
  onOpenDatePicker: () => void;
  onCloseDatePicker: () => void;
  onApplyDateRange: (range: DateRangeParams, preset: DateRangePreset) => void;
};

function DateIndicator({
  value,
  trailingComma = false,
}: {
  value: string;
  trailingComma?: boolean;
}) {
  return (
    <div className="flex flex-row items-center gap-[10px] text-sm text-hint-text-color">
      <NoteText size={18} color="var(--hint-text-color)" variant="Linear" />
      <span className="whitespace-nowrap">
        {formatDisplayDate(value, { trailingComma })}
      </span>
    </div>
  );
}

export default function DashboardTopBar({
  title,
  startDate,
  endDate,
  isDatePickerOpen,
  onOpenDatePicker,
  onCloseDatePicker,
  onApplyDateRange,
}: DashboardTopBarProps) {
  return (
    <div className="relative flex flex-col gap-[16px] border-b border-divider-color px-[24px] py-[20px] md:flex-row md:items-center md:justify-between md:px-[48px] md:py-[24px]">
      <h1 className="hidden text-[28px] font-semibold md:block">{title}</h1>

      <div className="flex flex-row flex-wrap items-center gap-[10px] md:gap-[12px]">
        <div
          className="flex flex-row items-center gap-[16px] rounded-[12px] border border-divider-color bg-background px-[14px] py-[10px]"
          aria-label={`Date range from ${startDate} to ${endDate}`}
        >
          <DateIndicator value={startDate} />
          <DateIndicator value={endDate} trailingComma />
        </div>

        <button
          type="button"
          onClick={isDatePickerOpen ? onCloseDatePicker : onOpenDatePicker}
          className={`primary-button flex flex-row items-center gap-[8px] !rounded-[12px] !px-[16px] !py-[10px] text-xs font-semibold uppercase tracking-wide ${
            isDatePickerOpen
              ? "!border !border-primary !bg-background !text-primary"
              : "!bg-secondary !text-button-foreground"
          }`}
        >
          <Filter
            size={16}
            color={isDatePickerOpen ? "var(--primary)" : "var(--button-foreground)"}
            variant="Bold"
          />
          Today
        </button>
      </div>

      <DashboardDatePicker
        isOpen={isDatePickerOpen}
        appliedRange={{ startDate, endDate }}
        onClose={onCloseDatePicker}
        onApply={onApplyDateRange}
      />
    </div>
  );
}
