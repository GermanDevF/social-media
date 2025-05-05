"use client";

import InfiniteScrollContainer from "@/components/infinite-scroll-container";
import Post from "@/components/posts/post";
import PostsSkeleton from "@/components/ui/skeletons/posts-skeleton";
import kyInstance from "@/lib/ky";
import { PostPage } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";

export default function SearchResults({ q }: { q: string }) {
  const { data, fetchNextPage, isFetchingNextPage, status, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["post-feed", "search", q],
      queryFn: ({ pageParam }) =>
        kyInstance
          .get(
            "/api/search",
            pageParam
              ? { searchParams: { cursor: pageParam, q } }
              : { searchParams: { q } },
          )
          .json<PostPage>(),
      initialPageParam: null as string | null,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 0,
    });

  const posts = data?.pages.flatMap((page) => page.posts) || [];

  if (status === "error") {
    return (
      <div className="flex w-full items-center justify-center">
        <div className="flex flex-col items-center gap-3 p-5 text-center">
          <h2 className="text-lg font-bold">Error al buscar</h2>
          <p className="text-muted-foreground">
            Error al buscar publicaciones.
          </p>
        </div>
      </div>
    );
  }

  if (status === "pending") {
    return <PostsSkeleton />;
  }

  if (status === "success" && posts.length === 0 && !hasNextPage) {
    return (
      <div className="flex w-full items-center justify-center">
        <div className="flex flex-col items-center gap-3 p-5 text-center">
          <h2 className="text-lg font-bold">No hay resultados</h2>
          <p className="text-muted-foreground">
            No hay resultados para la búsqueda &quot;{q}&quot;.
          </p>
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
