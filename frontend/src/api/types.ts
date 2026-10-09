// ============================================================
// API Contract Types — mirrors docs/API_CONTRACT.md exactly
// Do NOT add fields not in the contract.
// Request changes via docs/contract_requests.md
// ============================================================

// ── Session ─────────────────────────────────────────────────
export interface SessionResponse {
  token: string;
}

// ── Goals ───────────────────────────────────────────────────
export type GoalStatus = "created" | "needs_clarification" | "failed";

export interface ClarifyingQuestion {
  id: string;
  question: string;
}

export interface CreateGoalInput {
  goal_text: string;
  deadline: string; // ISO date string YYYY-MM-DD
  daily_hours: number;
  language_hint?: string;
  clarification_answers?: Record<string, string>;
}

export interface Milestone {
  id: string;
  title: string;
  description?: string;
  due_date: string;
  tasks: Task[];
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  estimated_hours: number;
  scheduled_date: string;
  milestone_id: string;
  status: TaskStatus;
  resources: Resource[];
}

export type TaskStatus = "pending" | "done" | "missed" | "skipped";

export interface Resource {
  title: string;
  url: string;
}

export interface Goal {
  id: string;
  goal_text: string;
  deadline: string;
  daily_hours: number;
  status: GoalStatus;
  progress_percent: number;
  milestones: Milestone[];
  tasks_today: Task[];
  missed_tasks_count: number;
  replan_suggested: boolean;
  created_at: string;
}

export interface CreateGoalResponse {
  status: GoalStatus;
  goal_id?: string;
  clarifying_questions?: ClarifyingQuestion[];
}

// ── Next Best Action ─────────────────────────────────────────
export interface NextAction {
  task_id: string;
  task_title: string;
  estimated_hours: number;
  milestone_title: string;
}

// ── Tasks ────────────────────────────────────────────────────
export interface SetTaskStatusInput {
  status: TaskStatus;
}

export interface SetTaskStatusResponse {
  task_id: string;
  status: TaskStatus;
  replan_suggested: boolean;
}

// ── Re-plan ──────────────────────────────────────────────────
export type ReplanOption = "extend_deadline" | "cut_scope" | "increase_hours";

export interface ReplanInput {
  option?: ReplanOption;
}

export interface ReplanTaskDiff {
  task_id: string;
  task_title: string;
  change: "moved" | "removed" | "added";
  old_date?: string;
  new_date?: string;
}

export interface ReplanProposal {
  proposal_id: string;
  feasible: boolean;
  explanation: string;
  diff: ReplanTaskDiff[];
  options?: ReplanOption[]; // present when feasible=false
}

export interface ReplanAcceptResponse {
  success: boolean;
}

// ── Career ───────────────────────────────────────────────────
export type SkillLevel = "beginner" | "intermediate" | "advanced";

export interface Skill {
  name: string;
  level: SkillLevel;
}

export type QuestionType = "single_choice" | "multi_choice" | "short_text";

export interface CareerQuestion {
  id: string;
  question: string;
  type: QuestionType;
  options?: string[];
}

export interface CareerAnalyzeInput {
  skills: Skill[];
  background?: string;
  interests?: string;
  answers?: Record<string, string | string[]>;
}

export type CareerStatus = "complete" | "needs_answers";

export interface SkillGap {
  skill: string;
  level_needed: SkillLevel;
}

export interface RoleMatch {
  role_id: string;
  title: string;
  fit_score: number; // 0-100
  fit_reasons: string[];
  skill_gaps: SkillGap[];
  estimated_weeks: number;
}

export interface CareerAnalyzeResponse {
  profile_id: string;
  status: CareerStatus;
  questions?: CareerQuestion[];
  roles?: RoleMatch[];
}

export interface SelectRoleInput {
  role_id: string;
  daily_hours: number;
  deadline: string;
}

export interface SelectRoleResponse {
  goal_id: string;
}

// ── Error format (from contract) ─────────────────────────────
export interface ApiErrorBody {
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
}

// ── Goals list (v1) ──────────────────────────────────────────
export interface GoalSummary {
  id: string;
  goal_text: string;
  deadline: string;
  progress_percent: number;
  status: GoalStatus;
  created_at: string;
}
