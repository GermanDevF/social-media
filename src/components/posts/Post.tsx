"use client";
import { useSession } from "@/app/(main)/session-provider";
import { PostData } from "@/lib/types";
import { cn, formatRelativeDate } from "@/lib/utils";
import Link from "next/link";
import { Linkify } from "../linkify";
import UserAvatar from "../user-avatar";
import UserTooltip from "../user-tooltip";
import PostMoreButton from "./post-more-button";
import { Media } from "@prisma/client";
import Image from "next/image";
import LikeButton from "./like-button";
import BookmarkButton from "./bookmark-button";
import { useState } from "react";
import { MessageCircle } from "lucide-react";
import Comments from "../comments/comments";

interface PostProps {
  post: PostData;
}

export default function Post({ post }: PostProps) {
  const { user } = useSession();

  const [showComments, setShowComments] = useState(false);

  return (
    <article className="group/post bg-card space-y-3 rounded-lg p-4 shadow-sm">
      <div className="flex justify-between gap-3">
        <div className="flex flex-wrap gap-3">
          <UserTooltip user={post.user}>
            <Link href={`/u/${post.user.username}`} className="flex gap-3">
              <UserAvatar
                avatarUrl={post.user.avatarUrl}
                className="sm:inline"
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
              suppressHydrationWarning
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
      {post.attachments.length > 0 && (
        <MediaPreviews attachments={post.attachments} />
      )}
      <hr className="text-muted-foreground" />
      <div className="flex items-center justify-between gap-5">
        <div className="flex items-center gap-5">
          <LikeButton
            postId={post.id}
            initialState={{
              likes: post._count.likes,
              isLikedByUser: post.likes.some((like) => like.userId === user.id),
            }}
          />
          <CommentsButton
            post={post}
            onClick={() => setShowComments(!showComments)}
          />
        </div>
        <BookmarkButton
          postId={post.id}
          initialState={{
            isBookmarkedByUser: post.bookmarks.some(
              (bookmark) => bookmark.userId === user.id,
            ),
          }}
        />
      </div>
      {showComments && <Comments post={post} />}
    </article>
  );
}

interface MediaPreviewsProps {
  attachments: Media[];
}

function MediaPreviews({ attachments }: MediaPreviewsProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-2",
        attachments.length > 1 && "sm:grid sm:grid-cols-2",
      )}
    >
      {attachments.map((attachment) => (
        <MediaPreview key={attachment.id} attachment={attachment} />
      ))}
    </div>
  );
}

interface MediaPreviewProps {
  attachment: Media;
}

function MediaPreview({ attachment }: MediaPreviewProps) {
  if (attachment.type === "IMAGE") {
    return (
      <Image
        src={attachment.url}
        alt="attachment preview "
        width={500}
        height={500}
        className="size-fit max-h-[30rem] rounded-lg"
      />
    );
  }

  if (attachment.type === "VIDEO") {
    return (
      <div>
        <video className="size-fit max-h-[30rem] rounded-lg" controls>
          <source src={attachment.url} type={attachment.type} />
        </video>
      </div>
    );
  }

  return (
    <p className="text-destructive">
      Lo sentimos, no se puede mostrar este archivo.
    </p>
  );
}

interface CommentsButtonProps {
  post: PostData;
  onClick: () => void;
}

function CommentsButton({ post, onClick }: CommentsButtonProps) {
  return (
    <button onClick={onClick} className="flex items-center gap-2">
      <MessageCircle className="size-5" />
      <span className="text-sm font-medium tabular-nums">
        {post._count.comments}
      </span>
    </button>
  );
}
