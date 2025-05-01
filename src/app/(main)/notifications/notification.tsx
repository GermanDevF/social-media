import UserAvatar from "@/components/user-avatar";
import { NotificationData } from "@/lib/types";
import { cn } from "@/lib/utils";
import { NotificationType } from "@prisma/client";
import { HeartIcon, MessageCircleIcon, UserPlusIcon } from "lucide-react";
import Link from "next/link";

interface NotificationProps {
  notification: NotificationData;
}

export default function Notification({ notification }: NotificationProps) {
  const notificationTypeMap: Record<
    NotificationType,
    {
      message: string;
      link: string;
      icon: React.ReactNode;
    }
  > = {
    [NotificationType.FOLLOW]: {
      message: `${notification.issuer.username} te siguió`,
      link: `/u/${notification.issuer.username}`,
      icon: <UserPlusIcon className="text-primary size-7" />,
    },
    [NotificationType.COMMENT]: {
      message: `${notification.issuer.username} comentó en tu publicación`,
      link: `/p/${notification.postId}`,
      icon: <MessageCircleIcon className="text-primary size-7" />,
    },
    [NotificationType.LIKE]: {
      message: `${notification.issuer.username} le dio like a tu publicación`,
      link: `/p/${notification.postId}`,
      icon: <HeartIcon className="size-7 fill-red-500 text-red-500" />,
    },
  };

  const { message, link, icon } = notificationTypeMap[notification.type];

  return (
    <Link href={link} className="block">
      <article
        className={cn(
          "bg-card hover:bg-card/70 flex gap-3 rounded-lg p-3 shadow-sm",
          !notification.read && "bg-primary/10",
        )}
      >
        <div className="my-1">{icon}</div>
        <div className="space-y-3">
          <UserAvatar avatarUrl={notification.issuer.avatarUrl} size={36} />
          <div>
            <span className="font-bold">{notification.issuer.displayName}</span>{" "}
            <span>{message}</span>
          </div>
          {notification.post && (
            <div className="text-muted-foreground line-clamp-2 whitespace-pre-line">
              {notification.post.content}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}
