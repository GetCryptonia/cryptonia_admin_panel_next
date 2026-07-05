"use server";

import { revalidatePath } from "next/cache";
import { toActionResult } from "@/lib/api/action_utils";
import type { ActionResult, PageParams } from "@/lib/api/types";
import type {
  ChangeRolePayload,
  Member,
  PaginatedMembers,
} from "./types";
import * as service from "./service";

export async function fetchMembersAction(
  params?: PageParams,
): Promise<ActionResult<PaginatedMembers>> {
  return toActionResult(() => service.getMembers(params));
}

export async function changeMemberRoleAction(
  memberId: string,
  payload: ChangeRolePayload,
): Promise<ActionResult<Member>> {
  const result = await toActionResult(() =>
    service.changeMemberRole(memberId, payload),
  );
  if (result.ok) revalidatePath("/members");
  return result;
}

export async function removeMemberAction(
  memberId: string,
): Promise<ActionResult<Member>> {
  const result = await toActionResult(() => service.removeMember(memberId));
  if (result.ok) revalidatePath("/members");
  return result;
}
