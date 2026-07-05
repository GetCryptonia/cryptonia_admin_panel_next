"use client";

type FilterSelectProps = {
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
};

export default function FilterSelect({
  value,
  onChange,
  children,
  disabled = false,
  className,
}: FilterSelectProps) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      disabled={disabled}
      className={`h-[40px] w-auto min-w-[140px] cursor-pointer rounded-[10px] border border-divider-color bg-background px-[14px] text-sm outline-none transition-colors focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 ${className ?? ""}`}
    >
      {children}
    </select>
  );
}
