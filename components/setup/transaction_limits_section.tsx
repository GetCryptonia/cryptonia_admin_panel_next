export default function TransactionLimitsSection() {
  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center rounded-[16px] border border-divider-color bg-background p-[48px] text-center shadow-[0_8px_24px_rgba(12,12,12,0.04)]">
      <p className="text-[20px] font-semibold">Transaction limits coming soon</p>
      <p className="mt-[8px] max-w-[420px] text-sm text-hint-text-color">
        Transaction limit configuration will be available here once the backend
        support is ready.
      </p>
    </div>
  );
}
