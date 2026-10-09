// ============================================================
// Session slice — manages anonymous session token state
// ============================================================

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { ensureSession } from "@/api/client";

export type SessionState = {
  ready: boolean;
  storageUnavailable: boolean;
  error: string | null;
};

const initialState: SessionState = {
  ready: false,
  storageUnavailable: false,
  error: null,
};

// Thunk to initialize session on app boot
export const initSession = createAsyncThunk(
  "session/init",
  async (_, { rejectWithValue }) => {
    try {
      let storageOk = true;
      try {
        localStorage.setItem("__test__", "1");
        localStorage.removeItem("__test__");
      } catch {
        storageOk = false;
      }
      await ensureSession();
      return { storageUnavailable: !storageOk };
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    setStorageUnavailable(state, action: PayloadAction<boolean>) {
      state.storageUnavailable = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initSession.fulfilled, (state, action) => {
        state.ready = true;
        state.storageUnavailable = action.payload.storageUnavailable;
        state.error = null;
      })
      .addCase(initSession.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { setStorageUnavailable } = sessionSlice.actions;
export default sessionSlice.reducer;
