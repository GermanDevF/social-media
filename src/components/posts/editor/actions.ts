"use server";

import { validateRequest } from "@/auth";
import { createPostSchema } from "@/lib/validations";
import { prisma } from "@/lib/prisma";
import { getPostDataInclude, postDataInclude } from "@/lib/types";

export async function submitPost(input: {
  content: string;
  // mediaIds: string[];
}) {
  const { user } = await validateRequest();

  if (!user) throw new Error("Unauthorized");

  const { content } = createPostSchema.parse(input);

  const newPost = await prisma.post.create({
    data: {
      content,
      userId: user.id,
      // attachments: {
      //   connect: mediaIds.map((id) => ({ id })),
      // },
    },
    include: getPostDataInclude(user.id),
  });

  return newPost;
}
