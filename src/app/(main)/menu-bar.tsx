import { Button } from "@/components/ui/button";
import { Bookmark, Home, MessageSquareQuote } from "lucide-react";
import Link from "next/link";
import NotificationsButton from "./notifications-button";
import { validateRequest } from "@/auth";
import { prisma } from "@/lib/prisma";
interface MenuBarProps {
  className?: string;
}

export default async function MenuBar({ className }: MenuBarProps) {
  const { user } = await validateRequest();

  if (!user) return null;

  const unreadCount = await prisma.notification.count({
    where: {
      recipientId: user.id,
      read: false,
    },
  });

  return (
    <div className={className}>
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3"
        title="Home"
        asChild
      >
        <Link href="/">
          <Home />
          <span className="hidden lg:inline">Inicio</span>
        </Link>
      </Button>
      <NotificationsButton initialState={{ unreadCount }} />
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3"
        title="Messages"
        asChild
      >
        <Link href="/messages">
          <MessageSquareQuote />
          <span className="hidden lg:inline">Mensajes</span>
        </Link>
      </Button>
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3"
        title="Bookmarks"
        asChild
      >
        <Link href="/bookmarks">
          <Bookmark />
          <span className="hidden lg:inline">Guardados</span>
        </Link>
      </Button>
    </div>
  );
}
