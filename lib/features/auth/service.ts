import { apiRequest } from "@/lib/api/client";
import type { LoginPayload } from "./types";

export async function login(payload: LoginPayload): Promise<string> {
  return apiRequest<string>("/admin/login", {
    method: "POST",
    body: payload,
    authenticated: false,
  });
}
