import { Button } from "@/components/ui/button";
import { Bookmark, Home } from "lucide-react";
import Link from "next/link";
import NotificationsButton from "./notifications-button";
import { validateRequest } from "@/auth";
import { prisma } from "@/lib/prisma";
import MessagesButton from "./messages-button";
import streamServerClient from "@/lib/stream";
interface MenuBarProps {
  className?: string;
}

export default async function MenuBar({ className }: MenuBarProps) {
  const { user } = await validateRequest();

  if (!user) return null;

  const [unreadNotificationsCount, unreadMessagesCount] = await Promise.all([
    prisma.notification.count({
      where: {
        recipientId: user.id,
        read: false,
      },
    }),
    (await streamServerClient.getUnreadCount(user.id)).total_unread_count,
  ]);

  return (
    <div className={className}>
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3"
        title="Home"
        asChild
      >
        <Link href="/">
          <div className="relative flex items-center justify-start gap-3">
            <Home />
            <span className="hidden lg:inline">Inicio</span>
          </div>
        </Link>
      </Button>
      <NotificationsButton
        initialState={{ unreadCount: unreadNotificationsCount }}
      />
      <MessagesButton
        initialState={{ total_unread_count: unreadMessagesCount }}
      />
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3"
        title="Bookmarks"
        asChild
      >
        <Link href="/bookmarks">
          <div className="relative flex items-center justify-start gap-3">
            <Bookmark />
            <span className="hidden lg:inline">Guardados</span>
          </div>
        </Link>
      </Button>
    </div>
  );
}
