import type { BackOfficeRole } from "@/lib/features/auth/types";

export const MEMBER_ROLE_OPTIONS: { value: BackOfficeRole; label: string }[] =
  [
    { value: "admin", label: "Admin" },
    { value: "support", label: "Support" },
  ];

export function formatMemberRole(role: string): string {
  if (role === "admin") {
    return "Admin";
  }

  if (role === "support") {
    return "Support";
  }

  return role;
}
