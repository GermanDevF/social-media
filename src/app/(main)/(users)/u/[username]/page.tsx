import { validateRequest } from "@/auth";
import FollowButton from "@/components/follow-button";
import FollowerCounter from "@/components/follower-counter";
import { Linkify } from "@/components/linkify";
import TrendsSidebar from "@/components/trends-sidebar";
import UserAvatar from "@/components/user-avatar";
import { FollowerInfo, getUserDataSelect, UserData } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import { formatDate } from "date-fns";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { EditProfileButton } from "./edit-profile-button";
import UserPosts from "./user-posts";
import { prisma } from "@/lib/prisma";

interface UserPageProps {
  params: {
    username: string;
  };
}

const getUser = cache(async (username: string, loggedInUserId: string) => {
  const user = await prisma?.user.findFirst({
    where: {
      username: {
        equals: username,
        mode: "insensitive",
      },
    },
    select: getUserDataSelect(loggedInUserId),
  });

  if (!user) notFound();
  return user;
});

export async function generateMetadata({
  params,
}: UserPageProps): Promise<Metadata> {
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser) return { title: "No encontrado" };

  const { username } = await params;
  const user = await getUser(username, loggedInUser?.id);
  return {
    title: `${user.displayName} (@${user.username})`,
    description: `User profile for ${user.username}`,
  };
}

export default async function UserPage({ params }: UserPageProps) {
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser)
    return (
      <p className="text-destructive">
        No tienes permiso para ver esta página. Por favor, inicia sesión.
      </p>
    );

  const { username } = await params;

  const user = await getUser(username, loggedInUser?.id);
  if (!user) return notFound();

  const { displayName } = user;
  return (
    <div className="flex w-full min-w-0 gap-4">
      <div className="w-full min-w-0 space-y-5">
        <UserProfile user={user} loggedInUserId={loggedInUser.id} />
        <div className="bg-card rounded-lg p-4 shadow-sm">
          <h2 className="text-center text-2xl font-bold">
            Publicaciones de {displayName}
          </h2>
        </div>
        <UserPosts userId={user.id} />
      </div>
      <TrendsSidebar />
    </div>
  );
}

interface UserProfileProps {
  user: UserData;
  loggedInUserId: string;
}

async function UserProfile({ user, loggedInUserId }: UserProfileProps) {
  const followerInfo: FollowerInfo = {
    followers: user._count.followers,
    isFollowedByUser: user.followers.some(
      (follower) => follower.followerId === loggedInUserId,
    ),
  };

  return (
    <div className="bg-card sadow-sm h-fit space-y-5 rounded-lg p-5">
      <UserAvatar
        avatarUrl={user.avatarUrl}
        size={250}
        className="mx-auto size-full max-h-60 max-w-60 rounded-full"
      />
      <div className="flex flex-wrap gap-3 sm:flex-nowrap">
        <div className="me-auto space-y-3">
          <div>
            <h1 className="text-3xl font-bold">{user.displayName}</h1>
            <p className="text-muted-foreground">@{user.username}</p>
          </div>
          <div>
            Se unió el {formatDate(new Date(user.createdAt), "MMM d, yyyy")}
          </div>
          <div className="flex items-center gap-3">
            <span>
              Posts <strong>{formatNumber(user._count.posts)}</strong>{" "}
            </span>
            <FollowerCounter userId={user.id} initialState={followerInfo} />
          </div>
        </div>
        {user.id === loggedInUserId ? (
          <EditProfileButton user={user} />
        ) : (
          <FollowButton userId={user.id} initialState={followerInfo} />
        )}
      </div>
      {user.bio && (
        <>
          <hr />
          <Linkify>
            <div className="whitespace-hidden break-words whitespace-pre-line">
              {user.bio}
            </div>
          </Linkify>
        </>
      )}
    </div>
  );
}
