"use client";

import { UserData } from "@/lib/types";
import { Session } from "lucia";
import { createContext, useContext } from "react";

interface SessionContext {
  user: UserData;
  session: Session;
}

const SessionContext = createContext<SessionContext | null>(null);

export default function SessionProvider({
  children,
  value,
}: React.PropsWithChildren<{ value: SessionContext }>) {
  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);

  if (!context) {
    throw new Error(
      "cielos viejo creo que este hook esta fuera del SessionProvider 😪",
    );
  }

  return context;
}
