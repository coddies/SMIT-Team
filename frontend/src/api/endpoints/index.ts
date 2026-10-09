// ============================================================
// API Endpoints — typed functions per resource
// All calls go through client; never use fetch directly
// ============================================================

import { client } from "../client";
import {
  SessionResponse,
  CreateGoalInput,
  CreateGoalResponse,
  Goal,
  GoalSummary,
  NextAction,
  SetTaskStatusInput,
  SetTaskStatusResponse,
  ReplanInput,
  ReplanProposal,
  ReplanAcceptResponse,
  CareerAnalyzeInput,
  CareerAnalyzeResponse,
  SelectRoleInput,
  SelectRoleResponse,
} from "../types";

// ── Session ──────────────────────────────────────────────────
export const sessionApi = {
  create: () => client.post<SessionResponse>("/session"),
};

// ── Goals ────────────────────────────────────────────────────
export const goalsApi = {
  create: (input: CreateGoalInput) =>
    client.post<CreateGoalResponse>("/goals", input),

  getById: (goalId: string) => client.get<Goal>(`/goals/${goalId}`),

  list: () => client.get<GoalSummary[]>("/goals"),

  getNextAction: (goalId: string) =>
    client.get<NextAction>(`/goals/${goalId}/next-action`),

  replan: (goalId: string, input?: ReplanInput) =>
    client.post<ReplanProposal>(`/goals/${goalId}/replan`, input ?? {}),

  acceptReplan: (goalId: string, proposalId: string) =>
    client.post<ReplanAcceptResponse>(
      `/goals/${goalId}/replan/${proposalId}/accept`
    ),

  rejectReplan: (goalId: string, proposalId: string) =>
    client.post<ReplanAcceptResponse>(
      `/goals/${goalId}/replan/${proposalId}/reject`
    ),
};

// ── Tasks ────────────────────────────────────────────────────
export const tasksApi = {
  setStatus: (taskId: string, input: SetTaskStatusInput) =>
    client.post<SetTaskStatusResponse>(`/tasks/${taskId}/status`, input),
};

// ── Career ───────────────────────────────────────────────────
export const careerApi = {
  analyze: (input: CareerAnalyzeInput) =>
    client.post<CareerAnalyzeResponse>("/career/analyze", input),

  selectRole: (profileId: string, input: SelectRoleInput) =>
    client.post<SelectRoleResponse>(`/career/${profileId}/select-role`, input),
};
