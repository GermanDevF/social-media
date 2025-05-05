import { getGoogleAuth, lucia } from "@/auth";
import kyInstance from "@/lib/ky";
import { prisma } from "@/lib/prisma";
import streamServerClient from "@/lib/stream";
import { slugify } from "@/lib/utils";
import { OAuth2RequestError } from "arctic";
import { generateIdFromEntropySize } from "lucia";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = await req.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  const cookieStore = await cookies();
  const storedState = cookieStore.get("state")?.value;
  const storedCodeVerifier = cookieStore.get("code_verifier")?.value;

  if (
    !storedState ||
    !storedCodeVerifier ||
    !code ||
    !state ||
    state !== storedState
  ) {
    return new Response(null, { status: 400 });
  }

  try {
    const google = await getGoogleAuth();

    const { data: tokens } = (await google.validateAuthorizationCode(
      code,
      storedCodeVerifier,
    )) as { data: { access_token: string } };

    const googleUser = await kyInstance
      .get("https://www.googleapis.com/oauth2/v1/userinfo", {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
      })
      .json<{
        id: string;
        email: string;
        verified_email: boolean;
        name: string;
        given_name: string;
      }>();

    const existingUser = await prisma.user.findUnique({
      where: {
        googleId: googleUser.id,
      },
    });
    const luciaInstance = await lucia();

    if (existingUser) {
      const session = await luciaInstance.createSession(existingUser.id, {});
      const sessionCookie = luciaInstance.createSessionCookie(session.id);
      cookieStore.set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );

      return new Response(null, {
        status: 302,
        headers: {
          Location: "/",
        },
      });
    }

    const userId = generateIdFromEntropySize(10);
    const username = slugify(googleUser.name) + "-" + userId.slice(0, 5);

    await prisma.$transaction(async (tx) => {
      await tx.user.create({
        data: {
          id: userId,
          username,
          email: googleUser.email,
          passwordHash: "",
          displayName: googleUser.name,
          name: googleUser.given_name,
          googleId: googleUser.id,
        },
      });

      await streamServerClient.upsertUser({
        id: userId,
        username,
        name: username,
      });
    });

    const session = await luciaInstance.createSession(userId, {});
    const sessionCookie = luciaInstance.createSessionCookie(session.id);
    cookieStore.set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/",
      },
    });
  } catch (error) {
    console.error(error);
    if (error instanceof OAuth2RequestError)
      return new Response(null, { status: 400 });
    return new Response(null, { status: 500 });
  }
}
