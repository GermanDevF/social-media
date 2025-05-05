"use server";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { prisma } from "./lib/prisma";
import { Lucia, Session } from "lucia";
import { cache } from "react";
import { cookies } from "next/headers";
import { Google } from "arctic";

const adapter = new PrismaAdapter(prisma.session, prisma.user);

export const lucia = async () =>
  new Lucia(adapter, {
    sessionCookie: {
      expires: false,
      attributes: {
        secure: process.env.NODE_ENV === "production",
      },
    },
    getUserAttributes(databaseUserAttributes) {
      return {
        id: databaseUserAttributes.id,
        username: databaseUserAttributes.username,
        displayName: databaseUserAttributes.displayName,
        avatarUrl: databaseUserAttributes.avatarUrl,
        googleId: databaseUserAttributes.googleId,
      };
    },
  });

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  googleId: string | null;
}

export type User = {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  googleId: string | null;
  bio: string | null;
  createdAt: Date;
  followers: { followerId: string }[];
  _count: {
    posts: number;
    comments: number;
    followers: number;
  };
};

export const getGoogleAuth = async () =>
  new Google(
    process.env.GOOGLE_CLIENT_ID!,
    process.env.GOOGLE_CLIENT_SECRET!,
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback/google`,
  );

// Define los tipos de retorno para mayor claridad
type ValidateRequestResult =
  | {
      user: User;
      session: Session;
    }
  | {
      user: null;
      session: null;
    };

export const validateRequest = cache(
  async (): Promise<ValidateRequestResult> => {
    const cookie = await cookies();
    const luciaInstance = await lucia();
    const sessionId =
      cookie.get(luciaInstance.sessionCookieName)?.value ?? null;

    if (!sessionId) {
      return { user: null, session: null };
    }

    const result = await luciaInstance.validateSession(sessionId);

    try {
      if (result.session && result.session.fresh) {
        const sessionCookie = luciaInstance.createSessionCookie(
          result.session.id,
        );
        cookie.set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes,
        );
      }
      if (!result.session) {
        const sessionCookie = luciaInstance.createBlankSessionCookie();
        cookie.set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes,
        );
      }
    } catch {}

    if (!result.user) return { user: null, session: null };

    const userData = await prisma.user.findUnique({
      where: { id: result.user.id },
      select: {
        id: true,
        username: true,
        displayName: true,
        avatarUrl: true,
        googleId: true,
        bio: true,
        createdAt: true,
        followers: {
          select: {
            followerId: true,
          },
        },
        _count: {
          select: {
            posts: true,
            comments: true,
            followers: true,
          },
        },
      },
    });

    if (!userData) return { user: null, session: null };

    return {
      user: userData,
      session: result.session,
    };
  },
);
