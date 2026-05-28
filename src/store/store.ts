import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./slices/auth-slice";
import { counterReducer } from "./slices/counter-slice";
import { teamReducer } from "./slices/team-slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    counter: counterReducer,
    team: teamReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

