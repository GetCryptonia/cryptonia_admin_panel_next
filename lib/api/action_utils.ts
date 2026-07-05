import { ApiClientError } from "./errors";
import type { ActionResult } from "./types";

export async function toActionResult<T>(
  fn: () => Promise<T>,
): Promise<ActionResult<T>> {
  try {
    const data = await fn();
    return { ok: true, data };
  } catch (err) {
    if (err instanceof ApiClientError) {
      return { ok: false, message: err.message, statusCode: err.statusCode };
    }
    return { ok: false, message: "Something went wrong" };
  }
}
