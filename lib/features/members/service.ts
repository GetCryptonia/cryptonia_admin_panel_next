import { apiRequest } from "@/lib/api/client";
import type { PageParams } from "@/lib/api/types";
import type {
  ChangeRolePayload,
  Member,
  PaginatedMembers,
} from "./types";

export async function getMembers(
  params?: PageParams,
): Promise<PaginatedMembers> {
  return apiRequest<PaginatedMembers>("/admin-panel/members", { query: params });
}

export async function changeMemberRole(
  memberId: string,
  payload: ChangeRolePayload,
): Promise<Member> {
  return apiRequest<Member>(`/admin-panel/members/${memberId}/role`, {
    method: "PUT",
    body: payload,
  });
}

export async function removeMember(memberId: string): Promise<Member> {
  return apiRequest<Member>(`/admin-panel/members/${memberId}`, {
    method: "DELETE",
  });
}
