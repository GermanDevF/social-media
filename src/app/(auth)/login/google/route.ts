import { getGoogleAuth } from "@/auth";
import { generateCodeVerifier, generateState } from "arctic";
import { cookies } from "next/headers";

export async function GET() {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();

  const url = (await getGoogleAuth()).createAuthorizationURL(
    state,
    codeVerifier,
    ["profile", "email"],
  );

  const cookieStore = await cookies();
  cookieStore.set("state", state, {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 10,
    sameSite: "lax",
  });

  cookieStore.set("code_verifier", codeVerifier, {
    path: "/",
    httpOnly: true,
    maxAge: 60 * 10,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return Response.redirect(url);
}
