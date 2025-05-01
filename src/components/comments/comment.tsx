import { CommentData } from "@/lib/types";
import UserAvatar from "../user-avatar";
import Link from "next/link";
import UserTooltip from "../user-tooltip";
import { formatRelativeDate } from "@/lib/utils";
import CommentMoreButton from "./comment-more-button";
import { useSession } from "@/app/(main)/session-provider";

interface CommentProps {
  comment: CommentData;
}

export default function Comment({ comment }: CommentProps) {
  const { user } = useSession();
  return (
    <div className="group/comment flex items-start gap-3 py-3">
      <span className="sm:inline">
        <UserTooltip user={comment.user}>
          <Link href={`/u/${comment.user.username}`}>
            <UserAvatar
              avatarUrl={comment.user.avatarUrl}
              className="mt-1 size-6"
            />
          </Link>
        </UserTooltip>
      </span>
      <div>
        <div className="flex items-center gap-1 text-sm">
          <UserTooltip user={comment.user}>
            <Link href={`/u/${comment.user.username}`}>
              <p className="font-medium hover:underline">
                {comment.user.displayName}
              </p>
            </Link>
          </UserTooltip>
          <p className="text-muted-foreground text-sm">
            {formatRelativeDate(comment.createdAt)}
          </p>
        </div>
        <p className="text-sm">{comment.content}</p>
      </div>
      {comment.userId === user.id && (
        <CommentMoreButton
          comment={comment}
          className="ml-auto transition-opacity group-hover/comment:opacity-100 md:opacity-0"
        />
      )}
    </div>
  );
}
