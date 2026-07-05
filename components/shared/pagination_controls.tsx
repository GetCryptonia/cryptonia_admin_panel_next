"use client";

type PaginationControlsProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
};

export default function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
  disabled = false,
}: PaginationControlsProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex flex-row items-center justify-between gap-[12px] border-t border-divider-color pt-[20px]">
      <span className="text-sm text-hint-text-color">
        Page {currentPage} of {totalPages}
      </span>
      <div className="flex flex-row items-center gap-[8px]">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={disabled || currentPage <= 1}
          className="rounded-[10px] border border-divider-color px-[14px] py-[8px] text-xs font-semibold uppercase tracking-wide text-hint-text-color transition-colors hover:border-primary/30 hover:text-text-color disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={disabled || currentPage >= totalPages}
          className="rounded-[10px] border border-divider-color px-[14px] py-[8px] text-xs font-semibold uppercase tracking-wide text-hint-text-color transition-colors hover:border-primary/30 hover:text-text-color disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
