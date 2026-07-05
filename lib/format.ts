const FORMAT_LOCALE = "en-GB";

export function formatDate(value: string | null | undefined): string {
  if (!value) {
    return "—";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString(FORMAT_LOCALE, {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function formatDateTime(value: string | null | undefined): string {
  if (!value) {
    return "—";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString(FORMAT_LOCALE, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  });
}

export function formatNgnAmount(amount: number): string {
  return `₦${amount.toLocaleString(undefined, {
    maximumFractionDigits: 2,
  })}`;
}

export function formatUsdAmount(amount: number): string {
  return `$${amount.toLocaleString(undefined, {
    maximumFractionDigits: 2,
  })}`;
}

export function formatTokenAmount(amount: number): string {
  return amount.toLocaleString("en-GB", {
    maximumFractionDigits: 6,
  });
}

export function formatUsdTokenAmount(amount: number): string {
  return `$${amount.toLocaleString("en-GB", {
    maximumFractionDigits: 6,
  })}`;
}
