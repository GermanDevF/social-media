"use client";

import CounterRedDot from "@/components/counter-red-dot";
import { Button } from "@/components/ui/button";
import kyInstance from "@/lib/ky";
import { MessageCount } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { MessageSquare } from "lucide-react";
import Link from "next/link";

interface MessagesButtonProps {
  initialState: MessageCount;
}

export default function MessagesButton({ initialState }: MessagesButtonProps) {
  const { data } = useQuery({
    queryKey: ["unread-messages-count"],
    queryFn: () =>
      kyInstance.get("/api/messages/unread-count").json<MessageCount>(),
    initialData: initialState,
    refetchInterval: 60 * 1000,
  });

  return (
    <Button
      variant="ghost"
      className="flex items-center justify-start gap-3"
      title="Messages"
      asChild
    >
      <Link href="/messages">
        <div className="relative">
          <MessageSquare />
          <CounterRedDot count={data?.total_unread_count || 0} />
        </div>
        <span className="hidden lg:inline">Mensajes</span>
      </Link>
    </Button>
  );
}
