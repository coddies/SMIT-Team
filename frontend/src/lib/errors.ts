// ============================================================
// Error mapping — one place to turn ApiError codes into
// user-friendly messages per the SRS error handling matrix
// ============================================================

import { ApiError } from "@/api/client";

export type UserFacingError = {
  title: string;
  message: string;
  canRetry: boolean;
  retryDelay?: number; // seconds to suggest waiting
};

const CODE_MAP: Record<string, UserFacingError> = {
  NETWORK_ERROR: {
    title: "Can't reach the server",
    message: "Check your internet connection and try again.",
    canRetry: true,
  },
  TIMEOUT: {
    title: "Request timed out",
    message:
      "The AI took too long to respond. Please try again.",
    canRetry: true,
  },
  AI_BUSY: {
    title: "AI is busy",
    message: "The AI is busy right now. Please try again in a moment.",
    canRetry: true,
    retryDelay: 30,
  },
  AI_INVALID_OUTPUT: {
    title: "Something went wrong",
    message:
      "The AI returned an unexpected response. Please try again.",
    canRetry: true,
  },
  HTTP_429: {
    title: "Too many requests",
    message:
      "You've made too many requests. Please wait a moment before trying again.",
    canRetry: true,
    retryDelay: 60,
  },
  HTTP_404: {
    title: "Not found",
    message: "The requested resource could not be found.",
    canRetry: false,
  },
  HTTP_401: {
    title: "Session expired",
    message: "Your session has expired. Refreshing...",
    canRetry: true,
  },
};

const SERVER_ERROR: UserFacingError = {
  title: "Something went wrong",
  message: "An unexpected error occurred. Please try again.",
  canRetry: true,
};

const VALIDATION_ERROR: UserFacingError = {
  title: "Invalid input",
  message: "Please check the form for errors.",
  canRetry: false,
};

export function mapError(err: unknown): UserFacingError {
  if (err instanceof ApiError) {
    // Field validation errors
    if (err.status === 400 || err.status === 422) {
      return {
        ...VALIDATION_ERROR,
        message: err.message || VALIDATION_ERROR.message,
      };
    }
    // Known error codes
    const mapped =
      CODE_MAP[err.code] ?? CODE_MAP[`HTTP_${err.status}`] ?? SERVER_ERROR;
    return {
      ...mapped,
      message: err.message || mapped.message,
    };
  }
  if (err instanceof Error) {
    return { ...SERVER_ERROR, message: err.message };
  }
  return SERVER_ERROR;
}
