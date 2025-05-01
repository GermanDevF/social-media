"use client";

import InfiniteScrollContainer from "@/components/infinite-scroll-container";
import { Button } from "@/components/ui/button";
import PostsSkeleton from "@/components/ui/skeletons/posts-skeleton";
import kyInstance from "@/lib/ky";
import { NotificationPage } from "@/lib/types";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  type QueryKey,
} from "@tanstack/react-query";
import { useEffect } from "react";
import Notification from "./notification";

export default function Notifications() {
  const queryKey: QueryKey = ["notifications"];

  const { data, fetchNextPage, isFetchingNextPage, status, hasNextPage } =
    useInfiniteQuery({
      queryKey,
      queryFn: ({ pageParam }) =>
        kyInstance
          .get(
            "/api/notifications",
            pageParam ? { searchParams: { cursor: pageParam } } : {},
          )
          .json<NotificationPage>(),
      initialPageParam: null as string | null,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    });

  const queryClient = useQueryClient();

  const { mutate: markAsRead } = useMutation({
    mutationFn: () =>
      kyInstance.patch("/api/notifications/mark-as-read").json(),
    onSuccess: () => {
      queryClient.setQueryData(["unread-notifications-count"], {
        unreadCount: 0,
      });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  useEffect(() => {
    markAsRead();
  }, [markAsRead]);

  const notifications = data?.pages.flatMap((page) => page.notifications) || [];

  if (status === "error") {
    return <div>Error al cargar notificaciones</div>;
  }

  if (status === "pending") {
    return <PostsSkeleton />;
  }

  if (status === "success" && notifications.length === 0 && !hasNextPage) {
    return (
      <div className="flex w-full items-center justify-center">
        <div className="flex flex-col items-center gap-3 p-5 text-center">
          <h2 className="text-lg font-bold">No hay publicaciones</h2>
          <p className="text-muted-foreground">
            No tienes notificaciones en este momento.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="w-fit"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage || !hasNextPage}
          >
            Ver más
          </Button>
        </div>
      </div>
    );
  }

  return (
    <InfiniteScrollContainer
      className="animate-fade-in space-y-5 overflow-hidden"
      onBottomReached={() =>
        !isFetchingNextPage && hasNextPage && fetchNextPage()
      }
    >
      {notifications.map((notification) => (
        <Notification key={notification.id} notification={notification} />
      ))}
      {isFetchingNextPage && <PostsSkeleton />}
    </InfiniteScrollContainer>
  );
}
