"use server";

import { lucia as luciaInstance } from "@/auth";
import { prisma } from "@/lib/prisma";
import { SignUpValues, signUpSchema } from "@/lib/validations";
import { hash } from "@node-rs/argon2";
import { generateIdFromEntropySize } from "lucia";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import streamServerClient from "@/lib/stream";

export async function signUp(
  credentials: SignUpValues,
): Promise<{ error: string }> {
  try {
    const { username, email, password } = signUpSchema.parse(credentials);

    const passwordHash = await hash(password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    const userId = generateIdFromEntropySize(10);

    const existingUsername = await prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: "insensitive",
        },
      },
    });

    if (existingUsername) {
      return { error: "El nombre de usuario ya está en uso" };
    }

    const existingEmail = await prisma.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: "insensitive",
        },
      },
    });

    if (existingEmail) {
      return { error: "El correo electrónico ya está en uso" };
    }

    await prisma.$transaction(async (tx) => {
      await tx.user.create({
        data: {
          id: userId,
          username: username.toLowerCase(),
          email,
          passwordHash,
          displayName: username,
          name: username,
        },
      });

      await streamServerClient.upsertUser({
        id: userId,
        username,
        name: username,
      });
    });

    const lucia = await luciaInstance();
    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    const cookie = await cookies();
    cookie.set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

    return redirect("/");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return { error: "Error al crear la cuenta" };
  }
}
