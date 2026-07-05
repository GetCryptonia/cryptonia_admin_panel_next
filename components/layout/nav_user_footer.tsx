"use client";

import { logoutAction } from "@/lib/features/auth/actions";
import type { NavUserDisplay } from "@/lib/features/auth/utils";
import { LogoutCurve } from "iconsax-reactjs";
import { useState, useTransition } from "react";

type NavUserFooterProps = {
  user: NavUserDisplay;
  onNavigate?: () => void;
};

export default function NavUserFooter({ user, onNavigate }: NavUserFooterProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleConfirmLogout = () => {
    startTransition(async () => {
      await logoutAction();
    });
  };

  return (
    <>
      <div className="border-t border-divider-color px-[20px] py-[16px] md:px-[24px]">
        <div className="flex flex-row items-center gap-[12px]">
          <div className="flex size-[40px] shrink-0 items-center justify-center rounded-full bg-[#ECE8FF] text-sm font-semibold text-[#7B61FF]">
            {user.initials}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{user.name}</p>
            <p className="truncate text-xs text-hint-text-color">{user.role}</p>
          </div>

          <button
            type="button"
            onClick={() => {
              onNavigate?.();
              setIsDialogOpen(true);
            }}
            className="flex size-[36px] shrink-0 items-center justify-center rounded-[10px] transition-colors hover:bg-primary/5"
            aria-label="Log out"
          >
            <LogoutCurve size={22} color="var(--primary)" variant="Bulk" />
          </button>
        </div>
      </div>

      {isDialogOpen ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-[24px]">
          <div
            className="absolute inset-0"
            onClick={() => !isPending && setIsDialogOpen(false)}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-dialog-title"
            className="relative w-full max-w-[400px] rounded-[16px] border border-divider-color bg-background p-[24px] shadow-[0_16px_48px_rgba(12,12,12,0.16)]"
          >
            <h2 id="logout-dialog-title" className="text-[20px] font-semibold">
              Log out?
            </h2>
            <p className="mt-[8px] text-sm text-hint-text-color">
              Are you sure you want to log out of the admin panel?
            </p>

            <div className="mt-[24px] flex flex-row justify-end gap-[12px]">
              <button
                type="button"
                onClick={() => setIsDialogOpen(false)}
                disabled={isPending}
                className="rounded-[10px] border border-divider-color px-[16px] py-[10px] text-sm font-semibold uppercase tracking-wide text-hint-text-color transition-colors hover:border-primary/30 hover:text-text-color"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmLogout}
                disabled={isPending}
                className="primary-button !rounded-[10px] !px-[16px] !py-[10px] text-sm uppercase tracking-wide"
              >
                {isPending ? "Logging out..." : "Log out"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
