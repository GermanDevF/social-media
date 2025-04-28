"use server";

import { lucia, validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function logout() {
  const { session } = await validateRequest();

  if (!session) {
    throw new Error("Unauthorized");
  }
  const luciaInstance = await lucia();

  await luciaInstance.invalidateSession(session.id);

  const sessionCookie = luciaInstance.createBlankSessionCookie();

  const cookie = await cookies();

  cookie.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

  return redirect("/login");
}
