import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { mapTeamRow } from "@/lib/cms/mappers";
import { team as fallbackTeam } from "@/lib/landing-content";
import type { PersonCard } from "@/lib/landing-content";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import type { RootState } from "../store";

export interface TeamRow {
  id: string;
  full_name: string;
  description: string | null;
  avatar_url: string | null;
}

export interface TeamState {
  title: string;
  subtitle: string;
  members: PersonCard[];
  loading: boolean;
  error: string | null;
  loaded: boolean;
}

const initialState: TeamState = {
  title: fallbackTeam.title,
  subtitle: fallbackTeam.subtitle,
  members: [],
  loading: false,
  error: null,
  loaded: false,
};

export const fetchTeams = createAsyncThunk<
  PersonCard[],
  void,
  { state: RootState; rejectValue: string }
>("team/fetchTeams", async (_, { rejectWithValue }) => {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("teams")
    .select("id,full_name,description,avatar_url")
    .eq("status", "active")
    .order("joined_at", { ascending: true });

  if (error) {
    const message = error.message.includes("profiles")
      ? 'Supabase still exposes teams as a view on missing "profiles". In SQL Editor run: drop view if exists public.teams cascade; then notify pgrst, \'reload schema\';'
      : error.message;
    console.error("[team] teams fetch failed:", message);
    return rejectWithValue(message);
  }

  if (!data?.length) {
    return rejectWithValue(
      "No rows in public.teams with status = active. Add team members in Supabase."
    );
  }

  return data.map((row) => mapTeamRow(row as TeamRow));
});

const teamSlice = createSlice({
  name: "team",
  initialState,
  reducers: {
    resetTeam(state) {
      state.members = [];
      state.loaded = false;
      state.error = null;
      state.loading = false;
    },
    setTeamTitle(state, action: PayloadAction<string>) {
      state.title = action.payload;
    },
    setTeamSubtitle(state, action: PayloadAction<string>) {
      state.subtitle = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeams.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeams.fulfilled, (state, action) => {
        state.loading = false;
        state.loaded = true;
        state.members = action.payload;
        state.error = null;
      })
      .addCase(fetchTeams.rejected, (state, action) => {
        state.loading = false;
        state.loaded = true;
        state.members = [];
        state.error =
          action.payload ??
          action.error.message ??
          "Failed to load team from Supabase";
      });
  },
});

export const teamReducer = teamSlice.reducer;
export const teamActions = teamSlice.actions;

export const selectTeam = (state: RootState) => state.team;
export const selectTeamSectionData = (state: RootState) => ({
  title: state.team.title,
  subtitle: state.team.subtitle,
  members: state.team.members,
});
