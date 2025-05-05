"use server";
import { validateRequest } from "@/auth";
import { updateUserSchema, type UpdateUserValues } from "@/lib/validations";
import { prisma } from "@/lib/prisma";
import { getUserDataSelect } from "@/lib/types";
import streamServerClient from "@/lib/stream";

export async function updateUser(values: UpdateUserValues) {
  const { user } = await validateRequest();

  if (!user) throw new Error("User not found");

  const validatedValues = updateUserSchema.parse(values);

  const updatedUser = await prisma.$transaction(async (tx) => {
    const updatedUser = await tx.user.update({
      where: { id: user.id },
      data: validatedValues,
      select: getUserDataSelect(user.id),
    });
    await streamServerClient.partialUpdateUser({
      id: user.id,
      set: {
        name: validatedValues.displayName,
      },
    });
    return updatedUser;
  });

  return updatedUser;
}
