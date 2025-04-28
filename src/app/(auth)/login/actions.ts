"use server";

import { prisma } from "@/lib/prisma";
import { loginSchema, LoginValues } from "@/lib/validations";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";
import { verify } from "@node-rs/argon2";
import { lucia } from "@/auth";
import { cookies } from "next/headers";

export async function login(
  credentials: LoginValues,
): Promise<{ error: string }> {
  try {
    const { username, password } = loginSchema.parse(credentials);

    const existingUser = await prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: "insensitive",
        },
      },
    });

    if (!existingUser || !existingUser.passwordHash) {
      return { error: "Nombre de usuario o contraseña incorrectos" };
    }

    const isValidPassword = await verify(existingUser.passwordHash, password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    if (!isValidPassword) {
      return { error: "Nombre de usuario o contraseña incorrectos" };
    }

    const luciaInstance = await lucia();

    const session = await luciaInstance.createSession(existingUser.id, {});
    const sessionCookie = luciaInstance.createSessionCookie(session.id);
    const cookie = await cookies();
    cookie.set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

    return redirect("/");
  } catch (error) {
    if (isRedirectError(error)) throw error;

    return { error: "Error de inicio de sesión" };
  }
}
