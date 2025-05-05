"use client";

import InfiniteScrollContainer from "@/components/infinite-scroll-container";
import Post from "@/components/posts/post";
import PostsSkeleton from "@/components/ui/skeletons/posts-skeleton";
import kyInstance from "@/lib/ky";
import { PostPage } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";

interface UserPostsProps {
  userId: string;
}

export default function UserPosts({ userId }: UserPostsProps) {
  const { data, fetchNextPage, isFetchingNextPage, status, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["post-feed", "user-posts", userId],
      queryFn: ({ pageParam }) =>
        kyInstance
          .get(
            `/api/users/${userId}/posts`,
            pageParam ? { searchParams: { cursor: pageParam } } : {},
          )
          .json<PostPage>(),
      initialPageParam: null as string | null,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      staleTime: 1000 * 60 * 5, // 5 minutes
    });

  const posts = data?.pages.flatMap((page) => page.posts) || [];

  if (status === "error") {
    console.error("Error al cargar publicaciones");
    return (
      <div>Error al cargar publicaciones. Por favor, inténtalo de nuevo.</div>
    );
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
            Este usuario no ha publicado nada aún.
          </p>
        </div>
      </div>
    );
  }

  return (
    <InfiniteScrollContainer
      className="animate-fade-in space-y-5 overflow-hidden"
      onBottomReached={() => {
        if (!isFetchingNextPage && hasNextPage) {
          fetchNextPage();
        }
      }}
    >
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
      {isFetchingNextPage && <PostsSkeleton />}
    </InfiniteScrollContainer>
  );
}
