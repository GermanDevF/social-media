import { validateRequest } from "@/auth";
import FollowButton from "@/components/follow-button";
import { Linkify } from "@/components/linkify";
import Post from "@/components/posts/post";
import UserAvatar from "@/components/user-avatar";
import UserTooltip from "@/components/user-tooltip";
import { prisma } from "@/lib/prisma";
import { getPostDataInclude, UserData } from "@/lib/types";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache, Suspense } from "react";

interface Props {
  params: {
    id: string;
  };
}

const getPost = cache(async (id: string, userId: string) => {
  const post = await prisma.post.findUnique({
    where: {
      id,
    },
    include: getPostDataInclude(userId),
  });

  if (!post) notFound();
  return post;
});

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const { user } = await validateRequest();

  if (!user) return {};

  const post = await getPost(id, user.id);

  return {
    title: `${post?.user.displayName} - ${post?.content.slice(0, 10)}...`,
    description: post?.content,
  };
}

export default async function PostPage({ params }: Props) {
  const { id } = await params;
  const { user } = await validateRequest();

  if (!user) {
    return (
      <p className="text-destructive">
        No tienes permiso para ver esta página. Por favor, inicia sesión.
      </p>
    );
  }

  const post = await getPost(id, user.id);

  if (!post) notFound();

  return (
    <main className="top-[5.25rem] flex w-full min-w-0 gap-4">
      <div className="w-full min-w-0 space-y-5">
        <Post post={post} />
        {/* <PostCard post={post} />
        <PostComments postId={id} /> */}
      </div>
      <div className="sticky top-0 hidden h-fit w-80 flex-none lg:block">
        <Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
          <UserInfoSidebar user={post.user} />
        </Suspense>
      </div>
    </main>
  );
}

interface UserInfoSidebarProps {
  user: UserData;
}

async function UserInfoSidebar({ user }: UserInfoSidebarProps) {
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser) return null;

  return (
    <div className="bg-card space-y-5 rounded-lg p-4 shadow-sm">
      <div className="text-xl font-bold">Sobre el autor</div>
      <UserTooltip user={user}>
        <Link href={`/u/${user.username}`} className="flex items-center gap-3">
          <UserAvatar avatarUrl={user.avatarUrl} className="flex-none" />
          <div>
            <p className="line-clamp-1 font-semibold break-all hover:underline">
              {user.displayName}
            </p>
            <p className="text-muted-foreground line-clamp-1 break-all">
              @{user.username}
            </p>
          </div>
        </Link>
      </UserTooltip>
      <Linkify>
        <div className="text-muted-foreground line-clamp-6 break-words whitespace-pre-line">
          {user.bio}
        </div>
      </Linkify>
      {user.id !== loggedInUser.id && (
        <FollowButton
          userId={user.id}
          initialState={{
            followers: user._count.followers,
            isFollowedByUser: user.followers.some(
              (follower) => follower.followerId === loggedInUser.id,
            ),
          }}
        />
      )}
    </div>
  );
}
