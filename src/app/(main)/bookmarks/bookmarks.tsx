"use client";

import InfiniteScrollContainer from "@/components/infinite-scroll-container";
import Post from "@/components/posts/post";
import { Button } from "@/components/ui/button";
import PostsSkeleton from "@/components/ui/skeletons/posts-skeleton";
import kyInstance from "@/lib/ky";
import { PostPage } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";

export default function Bookmarks() {
  const { data, fetchNextPage, isFetchingNextPage, status, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["post-feed", "bookmarks"],
      queryFn: ({ pageParam }) =>
        kyInstance
          .get(
            "/api/posts/bookmarked",
            pageParam ? { searchParams: { cursor: pageParam } } : {},
          )
          .json<PostPage>(),
      initialPageParam: null as string | null,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      staleTime: 1000 * 60 * 5, // 5 minutes
    });

  const posts = data?.pages.flatMap((page) => page.posts) || [];

  if (status === "error") {
    return <div>Error al cargar publicaciones marcadas como favoritas</div>;
  }

  if (status === "pending") {
    return <PostsSkeleton />;
  }

  if (status === "success" && posts.length === 0 && !hasNextPage) {
    return (
      <div className="flex w-full items-center justify-center">
        <div className="flex flex-col items-center gap-3 p-5 text-center">
          <h2 className="text-lg font-bold">No hay publicaciones</h2>
          <p className="text-muted-foreground">
            No tienes publicaciones marcadas como favoritas en este momento.
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
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
      {isFetchingNextPage && <PostsSkeleton />}
    </InfiniteScrollContainer>
  );
}
