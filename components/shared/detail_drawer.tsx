"use client";

import { useEffect } from "react";

type DetailDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  headerMeta?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
};

export default function DetailDrawer({
  isOpen,
  onClose,
  title,
  headerMeta,
  footer,
  children,
}: DetailDrawerProps) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="detail-drawer-title"
        className="relative flex h-full w-full flex-col bg-background shadow-[-8px_0_32px_rgba(12,12,12,0.12)] md:max-w-[560px] md:border-l md:border-divider-color"
      >
        <div className="flex shrink-0 flex-row items-center justify-between gap-[12px] border-b border-divider-color px-[20px] py-[16px] md:px-[24px]">
          <h2
            id="detail-drawer-title"
            className="min-w-0 truncate text-[18px] font-semibold capitalize md:text-[20px]"
          >
            {title}
          </h2>
          {headerMeta ? <div className="shrink-0">{headerMeta}</div> : null}
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
          {footer ? (
            <div className="shrink-0 border-t border-divider-color bg-background px-[20px] py-[16px] md:px-[24px]">
              {footer}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
