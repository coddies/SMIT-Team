// ============================================================
// Career slice — manages career analysis flow
// ============================================================

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { careerApi } from "@/api";
import type {
  CareerAnalyzeInput,
  CareerAnalyzeResponse,
  SelectRoleInput,
  RoleMatch,
  CareerQuestion,
} from "@/api/types";

export type CareerStep = "skills" | "questions" | "results" | "selecting";

export type CareerState = {
  step: CareerStep;
  profileId: string | null;
  questions: CareerQuestion[];
  roles: RoleMatch[];
  loading: boolean;
  error: string | null;
  selectedRoleGoalId: string | null;
};

const initialState: CareerState = {
  step: "skills",
  profileId: null,
  questions: [],
  roles: [],
  loading: false,
  error: null,
  selectedRoleGoalId: null,
};

// Analyze career
export const analyzeCareer = createAsyncThunk(
  "career/analyze",
  async (input: CareerAnalyzeInput, { rejectWithValue }) => {
    try {
      return await careerApi.analyze(input);
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

// Select a role
export const selectCareerRole = createAsyncThunk(
  "career/selectRole",
  async (
    { profileId, input }: { profileId: string; input: SelectRoleInput },
    { rejectWithValue }
  ) => {
    try {
      return await careerApi.selectRole(profileId, input);
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

const careerSlice = createSlice({
  name: "career",
  initialState,
  reducers: {
    resetCareer: () => initialState,
    setStep(state, action) {
      state.step = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Analyze
    builder
      .addCase(analyzeCareer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(analyzeCareer.fulfilled, (state, action) => {
        state.loading = false;
        const res = action.payload as CareerAnalyzeResponse;
        state.profileId = res.profile_id;
        if (res.status === "needs_answers") {
          state.questions = res.questions ?? [];
          state.step = "questions";
        } else {
          state.roles = res.roles ?? [];
          state.step = "results";
        }
      })
      .addCase(analyzeCareer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Select role
    builder
      .addCase(selectCareerRole.pending, (state) => {
        state.loading = true;
        state.step = "selecting";
        state.error = null;
      })
      .addCase(selectCareerRole.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedRoleGoalId = action.payload.goal_id;
      })
      .addCase(selectCareerRole.rejected, (state, action) => {
        state.loading = false;
        state.step = "results";
        state.error = action.payload as string;
      });
  },
});

export const { resetCareer, setStep } = careerSlice.actions;
export default careerSlice.reducer;
