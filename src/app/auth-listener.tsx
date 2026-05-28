"use client";

import { useEffect } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import { useAppDispatch } from "@/store/hooks";
import { authActions, loadProfile } from "@/store/slices/auth-slice";

export function AuthListener() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    let alive = true;

    supabase.auth.getSession().then(({ data, error }) => {
      if (!alive) return;
      if (error) dispatch(authActions.setAuthError(error.message));

      const user = data.session?.user ?? null;
      dispatch(
        authActions.setUser({
          userId: user?.id ?? null,
          email: user?.email ?? null,
        })
      );
      dispatch(authActions.setAuthInitialized());

      if (user?.id) {
        void dispatch(loadProfile({ userId: user.id }));
      }
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user ?? null;

      dispatch(
        authActions.setUser({
          userId: user?.id ?? null,
          email: user?.email ?? null,
        })
      );
      dispatch(authActions.setAuthInitialized());

      if (user?.id) {
        void dispatch(loadProfile({ userId: user.id }));
      } else {
        dispatch(authActions.clearAuth());
      }
    });

    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, [dispatch]);

  return null;
}

