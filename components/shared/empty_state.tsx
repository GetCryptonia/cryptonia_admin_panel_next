"use client";

type EmptyStateProps = {
  message: string;
};

export default function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="rounded-[12px] border border-dashed border-divider-color bg-divider-color/20 px-[24px] py-[32px] text-center">
      <p className="text-sm text-hint-text-color">{message}</p>
    </div>
  );
}
