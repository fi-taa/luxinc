import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";

export type ProfileRole = "member" | "admin";
export type ProfileStatus = "active" | "disabled";

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  avatar_url: string | null;
  role: ProfileRole;
  status: ProfileStatus;
}

export interface AuthState {
  userId: string | null;
  email: string | null;
  profile: Profile | null;
  initialized: boolean;
  loadingProfile: boolean;
  error: string | null;
}

const initialState: AuthState = {
  userId: null,
  email: null,
  profile: null,
  initialized: false,
  loadingProfile: false,
  error: null,
};

export const loadProfile = createAsyncThunk<
  Profile | null,
  { userId: string },
  { state: RootState; rejectValue: string }
>("auth/loadProfile", async ({ userId }, { rejectWithValue }) => {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id,email,full_name,phone,avatar_url,role,status")
    .eq("id", userId)
    .maybeSingle();

  if (error) return rejectWithValue(error.message);
  return (data as Profile | null) ?? null;
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthInitialized(state) {
      state.initialized = true;
    },
    setAuthError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    setUser(
      state,
      action: PayloadAction<{ userId: string | null; email: string | null }>
    ) {
      state.userId = action.payload.userId;
      state.email = action.payload.email;
      if (!action.payload.userId) {
        state.profile = null;
      }
    },
    clearAuth(state) {
      state.userId = null;
      state.email = null;
      state.profile = null;
      state.error = null;
      state.initialized = true;
      state.loadingProfile = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadProfile.pending, (state) => {
        state.loadingProfile = true;
        state.error = null;
      })
      .addCase(loadProfile.fulfilled, (state, action) => {
        state.loadingProfile = false;
        state.profile = action.payload;
      })
      .addCase(loadProfile.rejected, (state, action) => {
        state.loadingProfile = false;
        state.error =
          action.payload ?? action.error.message ?? "Failed to load profile";
      });
  },
});

export const authReducer = authSlice.reducer;
export const authActions = authSlice.actions;

export const selectAuth = (state: RootState) => state.auth;

