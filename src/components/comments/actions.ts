"use server";

import { validateRequest } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getCommentDataInclude, PostData } from "@/lib/types";
import { createCommentSchema } from "@/lib/validations";
import { NotificationType } from "@prisma/client";

export async function submitComment(input: {
  content: string;
  post: PostData;
}) {
  const { user } = await validateRequest();

  if (!user) throw new Error("Unauthorized");

  const { content } = createCommentSchema.parse({
    content: input.content,
  });

  const [comment] = await prisma.$transaction([
    prisma.comment.create({
      data: {
        content,
        userId: user.id,
        postId: input.post.id,
      },
      include: getCommentDataInclude(user.id),
    }),
    ...(user.id !== input.post.userId
      ? [
          prisma.notification.create({
            data: {
              recipientId: input.post.userId,
              issuerId: user.id,
              type: NotificationType.COMMENT,
              postId: input.post.id,
            },
          }),
        ]
      : []),
  ]);

  return comment;
}

export async function deleteComment(id: string) {
  const { user } = await validateRequest();

  if (!user) throw new Error("Unauthorized");

  const comment = await prisma.comment.findUnique({
    where: {
      id,
    },
  });

  if (!comment) throw new Error("No se encontró el comentario");

  if (comment.userId !== user.id) throw new Error("Unauthorized");

  const deletedComment = await prisma.comment.delete({
    where: {
      id,
    },
    include: getCommentDataInclude(user.id),
  });

  return deletedComment;
}
