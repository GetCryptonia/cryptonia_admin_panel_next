export type NavUserDisplay = {
  name: string;
  initials: string;
  role: string;
};

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
  }

  return name.slice(0, 2).toUpperCase();
}

export function getDisplayNameFromEmail(email: string): string {
  const localPart = email.split("@")[0] ?? email;

  return localPart
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function getNavUserDisplay(email?: string | null): NavUserDisplay {
  const name = email ? getDisplayNameFromEmail(email) : "Admin User";

  return {
    name,
    initials: getInitials(name),
    role: "Admin",
  };
}
