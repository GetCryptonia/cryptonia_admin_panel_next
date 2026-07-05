import { isNextNavigationError } from "@/lib/navigation/errors";
import { ApiClientError } from "./errors";
import type { ActionResult } from "./types";

export async function toActionResult<T>(
  fn: () => Promise<T>,
): Promise<ActionResult<T>> {
  try {
    const data = await fn();
    return { ok: true, data };
  } catch (err) {
    if (isNextNavigationError(err)) {
      throw err;
    }

    if (err instanceof ApiClientError) {
      return { ok: false, message: err.message, statusCode: err.statusCode };
    }

    if (err instanceof Error) {
      return { ok: false, message: err.message };
    }

    return { ok: false, message: "Something went wrong" };
  }
}
