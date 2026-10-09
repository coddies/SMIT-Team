// ============================================================
// API Client — single place for all network calls
// Adds session token, handles errors, timeouts, retries
// ============================================================

import { ApiErrorBody } from "./types";

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/+$/, "");
const TIMEOUT_MS = 45_000;

// ── Custom error type ────────────────────────────────────────
export class ApiError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status: number,
    public readonly details?: Record<string, string[]>
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// ── Session token management ─────────────────────────────────
const SESSION_KEY = "finishai_session_token";

function getToken(): string | null {
  try {
    return localStorage.getItem(SESSION_KEY);
  } catch {
    return null; // storage unavailable
  }
}

function setToken(token: string): void {
  try {
    localStorage.setItem(SESSION_KEY, token);
  } catch {
    // storage unavailable — token lives in memory via module closure
    _inMemoryToken = token;
  }
}

let _inMemoryToken: string | null = null;

function resolveToken(): string | null {
  return getToken() ?? _inMemoryToken;
}

// ── Core request helper ──────────────────────────────────────
async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  _retrying = false
): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  const token = resolveToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
  } catch (err) {
    clearTimeout(timeoutId);
    if ((err as Error).name === "AbortError") {
      throw new ApiError("TIMEOUT", "Request timed out. Please try again.", 0);
    }
    throw new ApiError(
      "NETWORK_ERROR",
      "Can't reach the server. Check your connection.",
      0
    );
  } finally {
    clearTimeout(timeoutId);
  }

  // 401 — try to refresh session once
  if (response.status === 401 && !_retrying) {
    await ensureSession(true);
    return request<T>(method, path, body, true);
  }

  if (!response.ok) {
    let errBody: ApiErrorBody | null = null;
    try {
      errBody = await response.json();
    } catch {
      // non-JSON error
    }

    if (errBody?.error) {
      throw new ApiError(
        errBody.error.code,
        errBody.error.message,
        response.status,
        errBody.error.details
      );
    }

    // Fallback HTTP error mapping
    throw new ApiError(
      `HTTP_${response.status}`,
      `Request failed (${response.status})`,
      response.status
    );
  }

  return response.json() as Promise<T>;
}

// ── Session bootstrap ────────────────────────────────────────
let _sessionBootstrap: Promise<void> | null = null;

export async function ensureSession(force = false): Promise<void> {
  if (!force && resolveToken()) return;

  if (_sessionBootstrap && !force) return _sessionBootstrap;

  _sessionBootstrap = (async () => {
    const data = await request<{ token: string }>("POST", "/session");
    setToken(data.token);
  })();

  return _sessionBootstrap;
}

// ── Public API ───────────────────────────────────────────────
export const client = {
  get: <T>(path: string) => request<T>("GET", path),
  post: <T>(path: string, body?: unknown) => request<T>("POST", path, body),
};
