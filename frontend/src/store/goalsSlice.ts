// ============================================================
// Goals slice — manages goal creation flow and re-plan state
// ============================================================

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { goalsApi } from "@/api";
import type {
  Goal,
  CreateGoalInput,
  CreateGoalResponse,
  ClarifyingQuestion,
  NextAction,
  ReplanProposal,
  ReplanOption,
  GoalSummary,
} from "@/api/types";

// ── State ────────────────────────────────────────────────────
export type GoalCreationStep = "idle" | "pending" | "clarifying" | "done" | "error";

export type GoalsState = {
  // Goal creation
  creationStep: GoalCreationStep;
  creationInput: CreateGoalInput | null;
  clarifyingQuestions: ClarifyingQuestion[];
  creationError: string | null;
  lastCreatedGoalId: string | null;

  // Active goal dashboard
  activeGoal: Goal | null;
  goalLoading: boolean;
  goalError: string | null;

  // Next best action
  nextAction: NextAction | null;
  nextActionLoading: boolean;

  // Re-plan
  replanProposal: ReplanProposal | null;
  replanLoading: boolean;
  replanError: string | null;

  // Goals list (v1)
  goalsList: GoalSummary[];
  goalsListLoading: boolean;
};

const initialState: GoalsState = {
  creationStep: "idle",
  creationInput: null,
  clarifyingQuestions: [],
  creationError: null,
  lastCreatedGoalId: null,
  activeGoal: null,
  goalLoading: false,
  goalError: null,
  nextAction: null,
  nextActionLoading: false,
  replanProposal: null,
  replanLoading: false,
  replanError: null,
  goalsList: [],
  goalsListLoading: false,
};

// ── Thunks ───────────────────────────────────────────────────
export const createGoal = createAsyncThunk(
  "goals/create",
  async (input: CreateGoalInput, { rejectWithValue }) => {
    try {
      return await goalsApi.create(input);
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const answerClarifications = createAsyncThunk(
  "goals/answerClarifications",
  async (
    answers: Record<string, string>,
    { dispatch, getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as { goals: GoalsState };
      const currentInput = state.goals.creationInput;
      if (!currentInput) {
        throw new Error("No pending goal creation input found");
      }
      return await dispatch(
        createGoal({
          ...currentInput,
          clarification_answers: answers,
        })
      ).unwrap();
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const fetchGoal = createAsyncThunk(
  "goals/fetchById",
  async (goalId: string, { rejectWithValue }) => {
    try {
      return await goalsApi.getById(goalId);
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const fetchNextAction = createAsyncThunk(
  "goals/fetchNextAction",
  async (goalId: string, { rejectWithValue }) => {
    try {
      return await goalsApi.getNextAction(goalId);
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const requestReplan = createAsyncThunk(
  "goals/replan",
  async (
    { goalId, option }: { goalId: string; option?: ReplanOption },
    { rejectWithValue }
  ) => {
    try {
      return await goalsApi.replan(goalId, option ? { option } : undefined);
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const acceptReplan = createAsyncThunk(
  "goals/acceptReplan",
  async (
    { goalId, proposalId }: { goalId: string; proposalId: string },
    { rejectWithValue }
  ) => {
    try {
      return await goalsApi.acceptReplan(goalId, proposalId);
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const rejectReplan = createAsyncThunk(
  "goals/rejectReplan",
  async (
    { goalId, proposalId }: { goalId: string; proposalId: string },
    { rejectWithValue }
  ) => {
    try {
      return await goalsApi.rejectReplan(goalId, proposalId);
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const fetchGoalsList = createAsyncThunk(
  "goals/list",
  async (_, { rejectWithValue }) => {
    try {
      return await goalsApi.list();
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

// ── Slice ────────────────────────────────────────────────────
const goalsSlice = createSlice({
  name: "goals",
  initialState,
  reducers: {
    resetCreation(state) {
      state.creationStep = "idle";
      state.creationInput = null;
      state.clarifyingQuestions = [];
      state.creationError = null;
      state.lastCreatedGoalId = null;
    },
    clearGoalCreation(state) {
      state.creationStep = "idle";
      state.creationError = null;
    },
    setCreationInput(state, action: PayloadAction<CreateGoalInput>) {
      state.creationInput = action.payload;
    },
    clearReplan(state) {
      state.replanProposal = null;
      state.replanError = null;
    },
    updateTaskStatusOptimistic(
      state,
      action: PayloadAction<{ taskId: string; status: import("@/api/types").TaskStatus }>
    ) {
      const { taskId, status } = action.payload;
      if (state.activeGoal) {
        state.activeGoal.tasks_today = state.activeGoal.tasks_today.map((t) =>
          t.id === taskId ? { ...t, status } : t
        );
        state.activeGoal.milestones = state.activeGoal.milestones.map((ms) => ({
          ...ms,
          tasks: ms.tasks.map((t) =>
            t.id === taskId ? { ...t, status } : t
          ),
        }));
      }
    },
  },
  extraReducers: (builder) => {
    // Create goal
    builder
      .addCase(createGoal.pending, (state, action) => {
        state.creationStep = "pending";
        state.creationError = null;
        state.creationInput = action.meta.arg;
      })
      .addCase(createGoal.fulfilled, (state, action) => {
        const res = action.payload as CreateGoalResponse;
        if (res.status === "needs_clarification") {
          state.creationStep = "clarifying";
          state.clarifyingQuestions = res.clarifying_questions ?? [];
        } else {
          state.creationStep = "done";
          state.lastCreatedGoalId = res.goal_id ?? null;
        }
      })
      .addCase(createGoal.rejected, (state, action) => {
        state.creationStep = "error";
        state.creationError = action.payload as string;
      });

    // Fetch goal
    builder
      .addCase(fetchGoal.pending, (state) => {
        state.goalLoading = true;
        state.goalError = null;
      })
      .addCase(fetchGoal.fulfilled, (state, action) => {
        state.goalLoading = false;
        state.activeGoal = action.payload;
      })
      .addCase(fetchGoal.rejected, (state, action) => {
        state.goalLoading = false;
        state.goalError = action.payload as string;
      });

    // Fetch next action
    builder
      .addCase(fetchNextAction.pending, (state) => {
        state.nextActionLoading = true;
      })
      .addCase(fetchNextAction.fulfilled, (state, action) => {
        state.nextActionLoading = false;
        state.nextAction = action.payload;
      })
      .addCase(fetchNextAction.rejected, (state) => {
        state.nextActionLoading = false;
      });

    // Replan
    builder
      .addCase(requestReplan.pending, (state) => {
        state.replanLoading = true;
        state.replanError = null;
        state.replanProposal = null;
      })
      .addCase(requestReplan.fulfilled, (state, action) => {
        state.replanLoading = false;
        state.replanProposal = action.payload;
      })
      .addCase(requestReplan.rejected, (state, action) => {
        state.replanLoading = false;
        state.replanError = action.payload as string;
      });

    // Accept/reject replan
    builder
      .addCase(acceptReplan.fulfilled, (state) => {
        state.replanProposal = null;
        if (state.activeGoal) {
          state.activeGoal.replan_suggested = false;
          state.activeGoal.missed_tasks_count = 0;
        }
      })
      .addCase(rejectReplan.fulfilled, (state) => {
        state.replanProposal = null;
      });

    // Goals list
    builder
      .addCase(fetchGoalsList.pending, (state) => {
        state.goalsListLoading = true;
      })
      .addCase(fetchGoalsList.fulfilled, (state, action) => {
        state.goalsListLoading = false;
        state.goalsList = action.payload;
      })
      .addCase(fetchGoalsList.rejected, (state) => {
        state.goalsListLoading = false;
      });
  },
});

export const {
  resetCreation,
  clearGoalCreation,
  setCreationInput,
  clearReplan,
  updateTaskStatusOptimistic,
} = goalsSlice.actions;
export default goalsSlice.reducer;
