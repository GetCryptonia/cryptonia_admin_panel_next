import type { PaginatedResponse } from "@/lib/api/types";
import type { BackOfficeRole } from "@/lib/features/auth/types";

export type Member = {
  id: string;
  username: string;
  email: string;
  role: BackOfficeRole | string;
};

export type PaginatedMembers = PaginatedResponse<
  Member,
  "members",
  "totalMembers"
>;

export type ChangeRolePayload = {
  role: BackOfficeRole;
};
