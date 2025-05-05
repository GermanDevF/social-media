import { validateRequest } from "@/auth";
import { prisma } from "@/lib/prisma";
import streamServerClient from "@/lib/stream";
import { MediaType } from "@prisma/client";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError, UTApi } from "uploadthing/server";

const f = createUploadthing();

export const fileRute = {
  avatar: f({
    image: {
      maxFileCount: 1,
      maxFileSize: "4MB",
    },
  })
    .middleware(async () => {
      const { user } = await validateRequest();

      if (!user) throw new UploadThingError("Unauthorized");

      const userWithAvatar = await prisma.user.findUnique({
        where: { id: user.id },
        select: { avatarUrl: true },
      });

      return {
        user: { ...user, avatarUrl: userWithAvatar?.avatarUrl || null },
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const oldAvatarUrl = metadata.user.avatarUrl;

      if (oldAvatarUrl) {
        const key = oldAvatarUrl.split(
          `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`,
        )[1];

        await new UTApi().deleteFiles([key]);
      }

      const newAvatarUrl = file.url.replace(
        "/f/",
        `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`,
      );

      await Promise.all([
        prisma.user.update({
          where: { id: metadata.user.id },
          data: { avatarUrl: newAvatarUrl },
        }),
        streamServerClient.partialUpdateUser({
          id: metadata.user.id,
          set: {
            image: newAvatarUrl,
          },
        }),
      ]);

      return {
        url: newAvatarUrl,
      };
    }),
  attachment: f({
    image: {
      maxFileCount: 5,
      maxFileSize: "4MB",
    },
    video: {
      maxFileCount: 5,
      maxFileSize: "64MB",
    },
  })
    .middleware(async () => {
      const { user } = await validateRequest();

      if (!user) throw new UploadThingError("Unauthorized");

      return {};
    })
    .onUploadComplete(async ({ file }) => {
      const media = await prisma.media.create({
        data: {
          url: file.url.replace(
            "/f/",
            `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`,
          ),
          type: file.type.startsWith("image")
            ? MediaType.IMAGE
            : MediaType.VIDEO,
        },
      });

      return { mediaId: media.id };
    }),
} satisfies FileRouter;

export type FileRoute = typeof fileRute;
