"use client";
import { useSession } from "@/app/(main)/session-provider";
import { PostData } from "@/lib/types";
import { formatRelativeDate } from "@/lib/utils";
import Link from "next/link";
import { Linkify } from "../linkify";
import UserAvatar from "../user-avatar";
import UserTooltip from "../user-tooltip";
import PostMoreButton from "./post-more-button";

interface PostProps {
  post: PostData;
}

export default function Post({ post }: PostProps) {
  const { user } = useSession();

  return (
    <article className="group/post bg-card space-y-3 rounded-lg p-4 shadow-sm">
      <div className="flex justify-between gap-3">
        <div className="flex flex-wrap gap-3">
          <UserTooltip user={post.user}>
            <Link href={`/u/${post.user.username}`} className="flex gap-3">
              <UserAvatar
                avatarUrl={post.user.avatarUrl}
                className="hidden sm:inline"
              />
            </Link>
          </UserTooltip>
          <div>
            <UserTooltip user={post.user}>
              <Link
                href={`/u/${post.user.username}`}
                className="text-lg font-medium hover:underline"
              >
                {post.user.displayName}
              </Link>
            </UserTooltip>
            <Link
              href={`/p/${post.id}`}
              className="text-muted-foreground block text-sm hover:underline"
            >
              {formatRelativeDate(post.createdAt)}
            </Link>
          </div>
        </div>
        {user.id === post.user.id && (
          <PostMoreButton
            post={post}
            className="opacity-0 transition-opacity group-hover/post:opacity-100"
          />
        )}
      </div>
      <Linkify>
        <p className="break-words whitespace-pre-line">{post.content}</p>
      </Linkify>
    </article>
  );
}
