"use client";

import { isUnauthorized } from "@/lib/api/unauthorized";
import type { ActionResult } from "@/lib/api/types";

export function redirectIfUnauthorized(result: ActionResult<unknown>): boolean {
  if (result.ok) {
    return false;
  }

  if (isUnauthorized(result.statusCode ?? 0, result.message)) {
    window.location.assign("/auth/login");
    return true;
  }

  return false;
}
