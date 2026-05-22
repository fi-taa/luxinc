"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { AuthModal } from "./auth-modal";

export type AuthModalView = "sign-in" | "sign-up";

interface AuthModalContextValue {
  openSignIn: () => void;
  openSignUp: () => void;
  close: () => void;
}

const AuthModalContext = createContext<AuthModalContextValue | null>(null);

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<AuthModalView | null>(null);

  const close = useCallback(() => setView(null), []);
  const openSignIn = useCallback(() => setView("sign-in"), []);
  const openSignUp = useCallback(() => setView("sign-up"), []);

  const value = useMemo(
    () => ({ openSignIn, openSignUp, close }),
    [openSignIn, openSignUp, close]
  );

  return (
    <AuthModalContext.Provider value={value}>
      {children}
      {view ? (
        <AuthModal
          view={view}
          onClose={close}
          onSwitch={(next) => setView(next)}
        />
      ) : null}
    </AuthModalContext.Provider>
  );
}

export function useAuthModal(): AuthModalContextValue {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error("useAuthModal must be used within AuthModalProvider");
  }
  return context;
}
