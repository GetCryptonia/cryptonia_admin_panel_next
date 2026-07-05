"use client";

import { SearchNormal1 } from "iconsax-reactjs";

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
};

export default function SearchInput({
  value,
  onChange,
  placeholder,
  className,
}: SearchInputProps) {
  return (
    <div className={`relative min-w-0 w-full flex-1 ${className ?? ""}`}>
      <span className="pointer-events-none absolute left-[14px] top-1/2 -translate-y-1/2">
        <SearchNormal1 size={18} color="var(--hint-text-color)" />
      </span>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full !rounded-[10px] !border !border-divider-color !bg-surface-color !py-[10px] !pl-[40px] !pr-[14px] text-sm focus:!border-primary"
      />
    </div>
  );
}
