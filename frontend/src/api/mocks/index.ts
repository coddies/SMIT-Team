// ============================================================
// Mock API layer — same function signatures as real endpoints
// Switched by NEXT_PUBLIC_USE_MOCKS=true env variable
// Includes deliberate slow responses and failure cases
// ============================================================

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

// Simulated network delay
const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// ── Mock data ────────────────────────────────────────────────
const MOCK_GOAL: Goal = {
  id: "goal-001",
  goal_text: "Learn Next.js and build a production-ready full-stack app",
  deadline: "2026-12-31",
  daily_hours: 2,
  status: "created",
  progress_percent: 35,
  missed_tasks_count: 1,
  replan_suggested: false,
  created_at: "2026-10-01T00:00:00Z",
  milestones: [
    {
      id: "ms-001",
      title: "Next.js Fundamentals",
      due_date: "2026-10-31",
      tasks: [
        {
          id: "task-001",
          title: "Complete Next.js tutorial",
          description:
            "Work through the official Next.js tutorial to understand App Router, routing, and data fetching patterns.",
          estimated_hours: 3,
          scheduled_date: new Date().toISOString().split("T")[0],
          milestone_id: "ms-001",
          status: "pending",
          resources: [
            {
              title: "Next.js Official Tutorial",
              url: "https://nextjs.org/learn",
            },
            {
              title: "App Router Documentation",
              url: "https://nextjs.org/docs/app",
            },
          ],
        },
        {
          id: "task-002",
          title: "Build a simple CRUD app with Next.js",
          description: "Practice building a simple app with API routes.",
          estimated_hours: 4,
          scheduled_date: new Date(Date.now() + 86400000)
            .toISOString()
            .split("T")[0],
          milestone_id: "ms-001",
          status: "pending",
          resources: [
            {
              title: "Next.js API Routes",
              url: "https://nextjs.org/docs/app/building-your-application/routing/route-handlers",
            },
          ],
        },
      ],
    },
    {
      id: "ms-002",
      title: "State Management with Redux Toolkit",
      due_date: "2026-11-15",
      tasks: [
        {
          id: "task-003",
          title: "Learn Redux Toolkit fundamentals",
          description:
            "Study slices, thunks, and RTK Query for server state management.",
          estimated_hours: 2,
          scheduled_date: new Date(Date.now() + 2 * 86400000)
            .toISOString()
            .split("T")[0],
          milestone_id: "ms-002",
          status: "missed",
          resources: [
            {
              title: "Redux Toolkit Quickstart",
              url: "https://redux-toolkit.js.org/introduction/getting-started",
            },
          ],
        },
      ],
    },
  ],
  tasks_today: [
    {
      id: "task-001",
      title: "Complete Next.js tutorial",
      description:
        "Work through the official Next.js tutorial to understand App Router, routing, and data fetching patterns.",
      estimated_hours: 3,
      scheduled_date: new Date().toISOString().split("T")[0],
      milestone_id: "ms-001",
      status: "pending",
      resources: [
        {
          title: "Next.js Official Tutorial",
          url: "https://nextjs.org/learn",
        },
      ],
    },
  ],
};

// ── Mock session ─────────────────────────────────────────────
export const mockSessionApi = {
  create: async (): Promise<SessionResponse> => {
    await delay(300);
    return { token: "mock-token-abc123" };
  },
};

// ── Mock goals ───────────────────────────────────────────────
let _mockGoalState: Goal = { ...MOCK_GOAL };

export const mockGoalsApi = {
  create: async (input: CreateGoalInput): Promise<CreateGoalResponse> => {
    await delay(3000); // simulate AI generation
    // Simulate clarifying questions on first call if no answers provided
    if (!input.clarification_answers && Math.random() > 0.5) {
      return {
        status: "needs_clarification",
        clarifying_questions: [
          {
            id: "q1",
            question: "What is your current experience level with this topic?",
          },
          {
            id: "q2",
            question:
              "Do you have any specific constraints or preferences for how you want to learn?",
          },
        ],
      };
    }
    _mockGoalState = {
      ...MOCK_GOAL,
      goal_text: input.goal_text,
      deadline: input.deadline,
      daily_hours: input.daily_hours,
    };
    return {
      status: "created",
      goal_id: "goal-001",
    };
  },

  getById: async (_goalId: string): Promise<Goal> => {
    await delay(400);
    return _mockGoalState;
  },

  list: async (): Promise<GoalSummary[]> => {
    await delay(500);
    return [
      {
        id: "goal-001",
        goal_text: _mockGoalState.goal_text,
        deadline: _mockGoalState.deadline,
        progress_percent: _mockGoalState.progress_percent,
        status: _mockGoalState.status,
        created_at: _mockGoalState.created_at,
      },
    ];
  },

  getNextAction: async (_goalId: string): Promise<NextAction> => {
    await delay(300);
    return {
      task_id: "task-001",
      task_title: "Complete Next.js tutorial",
      estimated_hours: 3,
      milestone_title: "Next.js Fundamentals",
    };
  },

  replan: async (
    _goalId: string,
    _input?: ReplanInput
  ): Promise<ReplanProposal> => {
    await delay(5000); // simulate AI re-planning
    return {
      proposal_id: "prop-001",
      feasible: true,
      explanation:
        "I've adjusted your schedule based on the missed tasks. The learning plan has been shifted by 3 days to accommodate your progress.",
      diff: [
        {
          task_id: "task-003",
          task_title: "Learn Redux Toolkit fundamentals",
          change: "moved",
          old_date: new Date(Date.now() + 2 * 86400000)
            .toISOString()
            .split("T")[0],
          new_date: new Date(Date.now() + 5 * 86400000)
            .toISOString()
            .split("T")[0],
        },
        {
          task_id: "task-004",
          task_title: "Practice project integration",
          change: "added",
          new_date: new Date(Date.now() + 6 * 86400000)
            .toISOString()
            .split("T")[0],
        },
      ],
    };
  },

  acceptReplan: async (
    _goalId: string,
    _proposalId: string
  ): Promise<ReplanAcceptResponse> => {
    await delay(500);
    _mockGoalState = {
      ..._mockGoalState,
      replan_suggested: false,
      missed_tasks_count: 0,
    };
    return { success: true };
  },

  rejectReplan: async (
    _goalId: string,
    _proposalId: string
  ): Promise<ReplanAcceptResponse> => {
    await delay(300);
    return { success: true };
  },
};

// ── Mock tasks ───────────────────────────────────────────────
export const mockTasksApi = {
  setStatus: async (
    taskId: string,
    input: SetTaskStatusInput
  ): Promise<SetTaskStatusResponse> => {
    await delay(400);
    // Update mock state
    _mockGoalState = {
      ..._mockGoalState,
      tasks_today: _mockGoalState.tasks_today.map((t) =>
        t.id === taskId ? { ...t, status: input.status } : t
      ),
      milestones: _mockGoalState.milestones.map((ms) => ({
        ...ms,
        tasks: ms.tasks.map((t) =>
          t.id === taskId ? { ...t, status: input.status } : t
        ),
      })),
    };
    return {
      task_id: taskId,
      status: input.status,
      replan_suggested: input.status === "missed",
    };
  },
};

// ── Mock career ──────────────────────────────────────────────
export const mockCareerApi = {
  analyze: async (
    input: CareerAnalyzeInput
  ): Promise<CareerAnalyzeResponse> => {
    await delay(4000);
    if (!input.answers) {
      return {
        profile_id: "profile-001",
        status: "needs_answers",
        questions: [
          {
            id: "cq1",
            question: "How many hours per week can you dedicate to learning?",
            type: "single_choice",
            options: ["< 5 hours", "5–10 hours", "10–20 hours", "20+ hours"],
          },
          {
            id: "cq2",
            question: "Which industries interest you most?",
            type: "multi_choice",
            options: ["Tech", "Finance", "Healthcare", "Education", "Other"],
          },
        ],
      };
    }
    return {
      profile_id: "profile-001",
      status: "complete",
      roles: [
        {
          role_id: "role-frontend",
          title: "Frontend Engineer",
          fit_score: 85,
          fit_reasons: [
            "Strong JavaScript foundation",
            "Experience with modern frameworks",
            "Eye for UI/UX",
          ],
          skill_gaps: [
            { skill: "TypeScript", level_needed: "advanced" },
            { skill: "Testing (Vitest/Jest)", level_needed: "intermediate" },
          ],
          estimated_weeks: 12,
        },
        {
          role_id: "role-fullstack",
          title: "Full-Stack Developer",
          fit_score: 72,
          fit_reasons: [
            "Frontend skills transferable",
            "Basic backend knowledge",
          ],
          skill_gaps: [
            { skill: "Node.js / Express", level_needed: "intermediate" },
            { skill: "Databases (PostgreSQL)", level_needed: "intermediate" },
            { skill: "DevOps basics", level_needed: "beginner" },
          ],
          estimated_weeks: 20,
        },
        {
          role_id: "role-ux",
          title: "UX/UI Designer",
          fit_score: 68,
          fit_reasons: ["Creative design sense", "User empathy"],
          skill_gaps: [
            { skill: "Figma (Advanced)", level_needed: "advanced" },
            { skill: "User Research Methods", level_needed: "intermediate" },
          ],
          estimated_weeks: 16,
        },
      ],
    };
  },

  selectRole: async (
    _profileId: string,
    _input: SelectRoleInput
  ): Promise<SelectRoleResponse> => {
    await delay(2000);
    return { goal_id: "goal-001" };
  },
};
