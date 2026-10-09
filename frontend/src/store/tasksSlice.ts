// ============================================================
// Tasks slice — manages task status updates (optimistic)
// ============================================================

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { tasksApi } from "@/api";
import type { TaskStatus } from "@/api/types";
import { updateTaskStatusOptimistic, fetchGoal, fetchNextAction } from "./goalsSlice";
import type { AppDispatch, RootState } from "./store";

export type TasksState = {
  updatingIds: string[];
  error: string | null;
};

const initialState: TasksState = {
  updatingIds: [],
  error: null,
};

// Optimistic thunk: update UI immediately, rollback on error
export const setTaskStatus = createAsyncThunk(
  "tasks/setStatus",
  async (
    {
      taskId,
      status,
      goalId,
    }: { taskId: string; status: TaskStatus; goalId: string },
    { dispatch, getState, rejectWithValue }
  ) => {
    const typedDispatch = dispatch as AppDispatch;

    // Capture previous status for rollback
    const state = getState() as RootState;
    const prevStatus =
      state.goals.activeGoal?.tasks_today.find((t) => t.id === taskId)
        ?.status ??
      state.goals.activeGoal?.milestones
        .flatMap((ms) => ms.tasks)
        .find((t) => t.id === taskId)?.status ??
      "pending";

    // Optimistic update
    typedDispatch(updateTaskStatusOptimistic({ taskId, status }));

    try {
      const res = await tasksApi.setStatus(taskId, { status });
      // Refresh goal data and next action after status change
      typedDispatch(fetchGoal(goalId));
      typedDispatch(fetchNextAction(goalId));
      return res;
    } catch (err) {
      // Rollback optimistic update
      typedDispatch(
        updateTaskStatusOptimistic({ taskId, status: prevStatus as TaskStatus })
      );
      return rejectWithValue((err as Error).message);
    }
  }
);

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    clearTaskError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(setTaskStatus.pending, (state, action) => {
        state.updatingIds.push(action.meta.arg.taskId);
        state.error = null;
      })
      .addCase(setTaskStatus.fulfilled, (state, action) => {
        state.updatingIds = state.updatingIds.filter(
          (id) => id !== action.meta.arg.taskId
        );
      })
      .addCase(setTaskStatus.rejected, (state, action) => {
        state.updatingIds = state.updatingIds.filter(
          (id) => id !== action.meta.arg.taskId
        );
        state.error = action.payload as string;
      });
  },
});

export const { clearTaskError } = tasksSlice.actions;
export default tasksSlice.reducer;
