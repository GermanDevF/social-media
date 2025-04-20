import { PostData } from "@/lib/types";
import Link from "next/link";
import UserAvatar from "../user-avatar";
import { formatRelativeDate } from "@/lib/utils";

interface PostProps {
  post: PostData;
}

export default function Post({ post }: PostProps) {
  return (
    <article className="bg-card space-y-3 rounded-lg p-4 shadow-sm">
      <div className="flex flex-wrap gap-3">
        <Link href={`/u/${post.user.username}`} className="flex gap-3">
          <UserAvatar
            avatarUrl={post.user.avatarUrl}
            className="hidden sm:inline"
          />
        </Link>
        <div>
          <Link
            href={`/u/${post.user.username}`}
            className="text-lg font-medium hover:underline"
          >
            {post.user.displayName}
          </Link>
          <Link
            href={`/p/${post.id}`}
            className="text-muted-foreground block text-sm hover:underline"
          >
            {formatRelativeDate(post.createdAt)}
          </Link>
        </div>
      </div>
      <p className="break-words whitespace-pre-line">{post.content}</p>
    </article>
  );
}
