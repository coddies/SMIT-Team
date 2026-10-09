// ============================================================
// Redux Store — root store configuration
// ============================================================

import { configureStore } from "@reduxjs/toolkit";
import sessionReducer from "./sessionSlice";
import goalsReducer from "./goalsSlice";
import tasksReducer from "./tasksSlice";
import careerReducer from "./careerSlice";

export const store = configureStore({
  reducer: {
    session: sessionReducer,
    goals: goalsReducer,
    tasks: tasksReducer,
    career: careerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
