import { redirectToLogin } from "@/lib/features/auth/redirect";
import { getToken } from "@/lib/features/auth/session";
import { isUnauthorized } from "@/lib/api/unauthorized";
import { ApiClientError } from "./errors";
import type { ApiResponse } from "./types";

type ApiRequestOptions = {
  method?: string;
  body?: unknown;
  query?: Record<string, string | number | undefined>;
  authenticated?: boolean;
};

function getBaseUrl(): string {
  const baseUrl = process.env.API_BASE_URL;
  if (!baseUrl) {
    throw new ApiClientError("API_BASE_URL is not configured", 500);
  }
  return baseUrl.replace(/\/$/, "");
}

function buildUrl(path: string, query?: ApiRequestOptions["query"]): string {
  const url = new URL(`${getBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`);

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    }
  }

  return url.toString();
}

function getStatusCode(
  response: Response,
  json?: ApiResponse<unknown>,
): number {
  const statusCode = json?.statusCode ?? response.status;
  return typeof statusCode === "number" ? statusCode : Number(statusCode);
}

function handleUnauthorized(authenticated: boolean, statusCode: number, message: string): void {
  if (authenticated && isUnauthorized(statusCode, message)) {
    redirectToLogin();
  }
}

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const { method = "GET", body, query, authenticated = true } = options;

  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  if (authenticated) {
    const token = await getToken();
    if (!token) {
      redirectToLogin();
    }
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(buildUrl(path, query), {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  let json: ApiResponse<T>;

  try {
    json = (await response.json()) as ApiResponse<T>;
  } catch {
    const message = "Invalid response from server";
    handleUnauthorized(authenticated, response.status, message);
    throw new ApiClientError(message, response.status);
  }

  if (!response.ok || !json.success) {
    const message = json.message || "Request failed";
    const statusCode = getStatusCode(response, json);

    handleUnauthorized(authenticated, statusCode, message);

    throw new ApiClientError(message, statusCode, json.error);
  }

  return json.data as T;
}
