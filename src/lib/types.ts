import { Prisma } from "@prisma/client";

export const userDataSelect = {
  id: true,
  username: true,
  displayName: true,
  avatarUrl: true,
} satisfies Prisma.UserSelect;

export const postDataInclude = {
  user: { select: userDataSelect },
} satisfies Prisma.PostInclude;

export function getUserDataSelect(loggedInUserId: string) {
  return {
    id: true,
    username: true,
    displayName: true,
    avatarUrl: true,
    // bio: true,
    createdAt: true,
    // followers: {
    //   where: {
    //     followerId: loggedInUserId,
    //   },
    //   select: {
    //     followerId: true,
    //   },
    // },
    _count: {
      select: {
        posts: true,
        // followers: true,
      },
    },
  } satisfies Prisma.UserSelect;
}

export function getPostDataInclude(loggedInUserId: string) {
  return {
    user: {
      select: getUserDataSelect(loggedInUserId),
    },
    // attachments: true,
    // likes: {
    //   where: {
    //     userId: loggedInUserId,
    //   },
    //   select: {
    //     userId: true,
    //   },
    // },
    // bookmarks: {
    //   where: {
    //     userId: loggedInUserId,
    //   },
    //   select: {
    //     userId: true,
    //   },
    // },
    _count: {
      select: {
        // likes: true,
        comments: true,
      },
    },
  } satisfies Prisma.PostInclude;
}

export type PostData = Prisma.PostGetPayload<{
  include: ReturnType<typeof getPostDataInclude>;
}>;

export interface PostPage {
  posts: PostData[];
  nextCursor: string | null;
}
