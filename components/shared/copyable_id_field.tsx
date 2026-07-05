"use client";

import { useState } from "react";

type CopyableIdFieldProps = {
  label?: string;
  value: string;
};

export default function CopyableIdField({
  label = "User ID",
  value,
}: CopyableIdFieldProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="rounded-[12px] border border-divider-color bg-background p-[14px]">
      <p className="text-xs font-semibold uppercase tracking-wide text-hint-text-color">
        {label}
      </p>
      <div className="mt-[4px] flex flex-row flex-wrap items-center gap-[10px]">
        <span className="min-w-0 flex-1 break-all font-mono text-xs">{value}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="shrink-0 rounded-[10px] border border-primary/30 px-[12px] py-[6px] text-xs font-semibold uppercase tracking-wide text-primary transition-colors hover:border-primary"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}
