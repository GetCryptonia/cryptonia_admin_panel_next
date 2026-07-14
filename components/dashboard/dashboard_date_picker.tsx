"use client";

import {
  customDisplayToIso,
  DATE_RANGE_PRESETS,
  detectPreset,
  getDateRangeForPreset,
  getDefaultDateRange,
  getDefaultPreset,
  isoToCustomDisplay,
  type DateRangePreset,
} from "@/lib/features/dashboard/date_range";
import type { DateRangeParams } from "@/lib/api/types";
import { Add, ArrowRight, Calendar } from "iconsax-reactjs";
import { useEffect, useRef, useState } from "react";

type DashboardDatePickerProps = {
  isOpen: boolean;
  appliedRange: DateRangeParams;
  onClose: () => void;
  onApply: (range: DateRangeParams, preset: DateRangePreset) => void;
};

type DateFieldProps = {
  id: string;
  label: string;
  displayValue: string;
  isoValue: string;
  onDisplayChange: (value: string) => void;
  onIsoChange: (iso: string) => void;
};

function DateField({
  id,
  label,
  displayValue,
  isoValue,
  onDisplayChange,
  onIsoChange,
}: DateFieldProps) {
  const calendarInputRef = useRef<HTMLInputElement>(null);

  const openCalendar = () => {
    const input = calendarInputRef.current;
    if (!input) {
      return;
    }

    if (typeof input.showPicker === "function") {
      try {
        input.showPicker();
        return;
      } catch {
        // Fall through to click() for browsers that block showPicker.
      }
    }

    input.click();
  };

  return (
    <div className="flex flex-col gap-[8px]">
      <label className="text-sm font-semibold" htmlFor={id}>
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type="text"
          value={displayValue}
          placeholder="DD | MM | YY"
          onChange={(event) => onDisplayChange(event.target.value)}
          className="!py-[12px] !px-[14px] !pr-[42px] text-center text-sm"
        />
        <button
          type="button"
          aria-label={`Open ${label.toLowerCase()} calendar`}
          onClick={openCalendar}
          className="absolute right-[10px] top-1/2 flex h-[28px] w-[28px] -translate-y-1/2 items-center justify-center rounded-[8px] text-hint-text-color transition-colors hover:bg-divider-color hover:text-text-color"
        >
          <Calendar size={18} color="currentColor" variant="Linear" />
        </button>
        <input
          ref={calendarInputRef}
          type="date"
          value={isoValue}
          onChange={(event) => {
            const nextIso = event.target.value;
            if (!nextIso) {
              return;
            }
            onIsoChange(nextIso);
          }}
          className="pointer-events-none absolute h-0 w-0 opacity-0"
          tabIndex={-1}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

export default function DashboardDatePicker({
  isOpen,
  appliedRange,
  onClose,
  onApply,
}: DashboardDatePickerProps) {
  const [selectedPreset, setSelectedPreset] = useState<DateRangePreset>("7d");
  const [draftStart, setDraftStart] = useState(appliedRange.startDate);
  const [draftEnd, setDraftEnd] = useState(appliedRange.endDate);
  const [startInput, setStartInput] = useState(
    isoToCustomDisplay(appliedRange.startDate),
  );
  const [endInput, setEndInput] = useState(
    isoToCustomDisplay(appliedRange.endDate),
  );

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const preset = detectPreset(appliedRange);
    setSelectedPreset(preset);
    setDraftStart(appliedRange.startDate);
    setDraftEnd(appliedRange.endDate);
    setStartInput(isoToCustomDisplay(appliedRange.startDate));
    setEndInput(isoToCustomDisplay(appliedRange.endDate));
  }, [appliedRange, isOpen]);

  if (!isOpen) {
    return null;
  }

  const applyPreset = (preset: DateRangePreset) => {
    const range = getDateRangeForPreset(preset);
    setSelectedPreset(preset);
    setDraftStart(range.startDate);
    setDraftEnd(range.endDate);
    setStartInput(isoToCustomDisplay(range.startDate));
    setEndInput(isoToCustomDisplay(range.endDate));
  };

  const handleStartInputChange = (value: string) => {
    setStartInput(value);
    const iso = customDisplayToIso(value);
    if (iso) {
      setDraftStart(iso);
      setSelectedPreset("custom");
    }
  };

  const handleEndInputChange = (value: string) => {
    setEndInput(value);
    const iso = customDisplayToIso(value);
    if (iso) {
      setDraftEnd(iso);
      setSelectedPreset("custom");
    }
  };

  const handleStartCalendarChange = (iso: string) => {
    setDraftStart(iso);
    setStartInput(isoToCustomDisplay(iso));
    setSelectedPreset("custom");
  };

  const handleEndCalendarChange = (iso: string) => {
    setDraftEnd(iso);
    setEndInput(isoToCustomDisplay(iso));
    setSelectedPreset("custom");
  };

  const handleReset = () => {
    const defaultRange = getDefaultDateRange();
    const defaultPreset = getDefaultPreset();
    setSelectedPreset(defaultPreset);
    setDraftStart(defaultRange.startDate);
    setDraftEnd(defaultRange.endDate);
    setStartInput(isoToCustomDisplay(defaultRange.startDate));
    setEndInput(isoToCustomDisplay(defaultRange.endDate));
  };

  const handleApply = () => {
    const startIso = customDisplayToIso(startInput) ?? draftStart;
    const endIso = customDisplayToIso(endInput) ?? draftEnd;

    if (!startIso || !endIso || startIso > endIso) {
      return;
    }

    onApply({ startDate: startIso, endDate: endIso }, selectedPreset);
    onClose();
  };

  return (
    <>
      <button
        type="button"
        aria-label="Close date picker"
        className="fixed inset-0 z-40 bg-transparent"
        onClick={onClose}
      />

      <div className="absolute right-[24px] top-[calc(100%+12px)] z-50 w-[min(520px,calc(100vw-48px))] rounded-[16px] border border-divider-color bg-background p-[24px] shadow-[0_12px_40px_rgba(0,0,0,0.08)] md:right-[48px]">
        <div className="relative mb-[24px] flex items-center justify-center">
          <h2 className="text-base font-semibold">Filter</h2>
          <button
            type="button"
            aria-label="Close filter"
            onClick={onClose}
            className="absolute right-0 flex h-[32px] w-[32px] items-center justify-center rounded-full bg-divider-color"
          >
            <span className="inline-flex rotate-45">
              <Add size={18} color="var(--text-color)" />
            </span>
          </button>
        </div>

        <div className="flex flex-col gap-[12px]">
          <p className="text-sm font-semibold">Duration</p>
          <div className="grid grid-cols-2 gap-[10px] sm:grid-cols-3">
            {DATE_RANGE_PRESETS.map((preset) => {
              const isActive = selectedPreset === preset.value;

              return (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => applyPreset(preset.value)}
                  className={`rounded-[12px] border px-[12px] py-[10px] text-sm transition-colors ${
                    isActive
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-divider-color text-hint-text-color"
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-[24px] flex flex-col gap-[12px]">
          <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-[10px]">
            <DateField
              id="dashboard-start-date"
              label="Start Date"
              displayValue={startInput}
              isoValue={draftStart}
              onDisplayChange={handleStartInputChange}
              onIsoChange={handleStartCalendarChange}
            />

            <ArrowRight
              size={18}
              color="var(--primary)"
              className="mb-[14px]"
              variant="Linear"
            />

            <DateField
              id="dashboard-end-date"
              label="End Date"
              displayValue={endInput}
              isoValue={draftEnd}
              onDisplayChange={handleEndInputChange}
              onIsoChange={handleEndCalendarChange}
            />
          </div>
        </div>

        <div className="mt-[24px] grid grid-cols-2 gap-[12px]">
          <button
            type="button"
            onClick={handleReset}
            className="rounded-[12px] border border-primary bg-background px-[16px] py-[12px] text-sm font-semibold uppercase tracking-wide text-text-color"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="primary-button !rounded-[12px] !py-[12px] text-sm uppercase tracking-wide"
          >
            Apply Filter
          </button>
        </div>
      </div>
    </>
  );
}
