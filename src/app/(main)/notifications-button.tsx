"use client";
import { Bell } from "lucide-react";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { NotificationCount } from "@/lib/types";
import kyInstance from "@/lib/ky";
import { useQuery } from "@tanstack/react-query";
import CounterRedDot from "@/components/counter-red-dot";

interface NotificationsButtonProps {
  initialState: NotificationCount;
}

export default function NotificationsButton({
  initialState,
}: NotificationsButtonProps) {
  const { data } = useQuery({
    queryKey: ["unread-notifications-count"],
    queryFn: () =>
      kyInstance
        .get("/api/notifications/unread-count")
        .json<NotificationCount>(),
    initialData: initialState,
    refetchInterval: 60 * 1000,
  });

  return (
    <Button
      variant="ghost"
      className="flex items-center justify-start gap-3"
      title="Notifications"
      asChild
    >
      <Link href="/notifications">
        <div className="relative">
          <Bell />
          <CounterRedDot count={data?.unreadCount || 0} />
        </div>
        <span className="hidden lg:inline">Notificaciones</span>
      </Link>
    </Button>
  );
}
