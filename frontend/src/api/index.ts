// ============================================================
// API index — switches between real endpoints and mocks
// based on NEXT_PUBLIC_USE_MOCKS environment variable
// ============================================================

import * as real from "./endpoints";
import {
  mockSessionApi,
  mockGoalsApi,
  mockTasksApi,
  mockCareerApi,
} from "./mocks";

const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS === "true";

export const sessionApi = USE_MOCKS ? mockSessionApi : real.sessionApi;
export const goalsApi = USE_MOCKS ? mockGoalsApi : real.goalsApi;
export const tasksApi = USE_MOCKS ? mockTasksApi : real.tasksApi;
export const careerApi = USE_MOCKS ? mockCareerApi : real.careerApi;

export * from "./types";
export { ApiError } from "./client";
