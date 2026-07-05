"use server";

import { redirect } from "next/navigation";
import { toActionResult } from "@/lib/api/action_utils";
import type { ActionResult } from "@/lib/api/types";
import { NAV_HOME } from "@/lib/constants/routes";
import * as service from "./service";
import { clearToken, setAdminEmail, setToken } from "./session";

export async function loginAction(
  email: string,
  password: string,
): Promise<ActionResult<void>> {
  const result = await toActionResult(() => service.login({ email, password }));

  if (!result.ok) {
    return result;
  }

  await setToken(result.data);
  await setAdminEmail(email);
  redirect(NAV_HOME);
}

export async function logoutAction(): Promise<void> {
  await clearToken();
  redirect("/auth/login");
}
