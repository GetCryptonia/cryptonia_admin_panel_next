import type { DateRangeParams } from "@/lib/api/types";

export type DateRangePreset =
  | "today"
  | "7d"
  | "30d"
  | "3m"
  | "6m"
  | "1y"
  | "custom";

export type DateRangePresetOption = {
  value: DateRangePreset;
  label: string;
};

export const DATE_RANGE_PRESETS: DateRangePresetOption[] = [
  { value: "today", label: "Today" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "3m", label: "Last 3 months" },
  { value: "6m", label: "Last 6 months" },
  { value: "1y", label: "Last 1 year" },
];

function formatIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function subtractMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() - months);
  return result;
}

function getOrdinalSuffix(day: number): string {
  if (day >= 11 && day <= 13) {
    return "th";
  }

  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

export function formatDisplayDate(
  dateValue: string,
  options?: { trailingComma?: boolean },
): string {
  const date = new Date(`${dateValue}T00:00:00`);
  const day = date.getDate();
  const month = date.toLocaleString("en-GB", { month: "short" });
  const year = date.getFullYear();
  const formatted = `${day}${getOrdinalSuffix(day)} ${month}${options?.trailingComma ? "," : ""} ${year}`;

  return formatted;
}

export function isoToCustomDisplay(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");
  return `${day} | ${month} | ${year.slice(2)}`;
}

export function customDisplayToIso(display: string): string | null {
  const parts = display.split("|").map((part) => part.trim());
  if (parts.length !== 3) {
    return null;
  }

  const [dayPart, monthPart, yearPart] = parts;
  const day = Number(dayPart);
  const month = Number(monthPart);
  const year =
    yearPart.length === 2 ? Number(`20${yearPart}`) : Number(yearPart);

  if (
    !Number.isInteger(day) ||
    !Number.isInteger(month) ||
    !Number.isInteger(year) ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31
  ) {
    return null;
  }

  const iso = `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  const parsed = new Date(`${iso}T00:00:00`);

  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return iso;
}

export function getDateRangeForPreset(
  preset: DateRangePreset,
  customStart?: string,
  customEnd?: string,
): DateRangeParams {
  const end = new Date();
  const start = new Date();

  if (preset === "today") {
    return { startDate: formatIsoDate(end), endDate: formatIsoDate(end) };
  }

  if (preset === "7d") {
    start.setDate(end.getDate() - 7);
    return { startDate: formatIsoDate(start), endDate: formatIsoDate(end) };
  }

  if (preset === "30d") {
    start.setDate(end.getDate() - 30);
    return { startDate: formatIsoDate(start), endDate: formatIsoDate(end) };
  }

  if (preset === "3m") {
    return {
      startDate: formatIsoDate(subtractMonths(end, 3)),
      endDate: formatIsoDate(end),
    };
  }

  if (preset === "6m") {
    return {
      startDate: formatIsoDate(subtractMonths(end, 6)),
      endDate: formatIsoDate(end),
    };
  }

  if (preset === "1y") {
    return {
      startDate: formatIsoDate(subtractMonths(end, 12)),
      endDate: formatIsoDate(end),
    };
  }

  return {
    startDate: customStart ?? formatIsoDate(start),
    endDate: customEnd ?? formatIsoDate(end),
  };
}

export function detectPreset(range: DateRangeParams): DateRangePreset {
  for (const preset of DATE_RANGE_PRESETS) {
    const expected = getDateRangeForPreset(preset.value);
    if (
      expected.startDate === range.startDate &&
      expected.endDate === range.endDate
    ) {
      return preset.value;
    }
  }

  return "custom";
}

export function getDefaultDateRange(): DateRangeParams {
  return getDateRangeForPreset("7d");
}

export function getDefaultPreset(): DateRangePreset {
  return "7d";
}
