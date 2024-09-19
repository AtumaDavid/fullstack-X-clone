"use client";

import { Session, User } from "lucia";
import React, { createContext, useContext } from "react";

interface SessionContext {
  user: User;
  session: Session;
}

const SessionContext = createContext<SessionContext | null>(null);
// Create a context named `SessionContext` to store the session information.
// It is initialized with `null` and will hold an object with `user` and `session` once provided.

export default function SessionProvider({
  children,
  value,
}: React.PropsWithChildren<{ value: SessionContext }>) {
  // `SessionProvider` is a component that wraps other components (children) and provides session context to them.
  // The `value` prop is expected to be an object that includes the user and session information.
  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
    // The `SessionContext.Provider` makes the session context (`value`) available to any child component that calls `useContext(SessionContext)`.
  );
}

export function useSession() {
  // `useSession` is a custom hook that allows components to access the session context.
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
  // Returns the session context (`user` and `session`) to the component that called `useSession`.
}
