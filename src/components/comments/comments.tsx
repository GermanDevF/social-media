import { CommentPage, PostData } from "@/lib/types";
import Comment from "./comment";
import CommentInput from "./comment-input";
import { useInfiniteQuery } from "@tanstack/react-query";
import kyInstance from "@/lib/ky";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

interface CommentsProps {
  post: PostData;
}

export default function Comments({ post }: CommentsProps) {
  const {
    data: dataSource,
    status,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["comments", post.id],
    queryFn: ({ pageParam = null }) =>
      kyInstance
        .get(
          `/api/posts/${post.id}/comments`,
          pageParam
            ? {
                searchParams: {
                  cursor: pageParam,
                },
              }
            : {},
        )
        .json<CommentPage>(),
    getNextPageParam: (lastPage) => lastPage.previousCursor,
    initialPageParam: null as string | null,
    select: (data) => ({
      pages: [...data.pages].reverse(),
      pageParams: [...data.pageParams].reverse(),
    }),
  });

  const comments = dataSource?.pages.flatMap((page) => page.comments);

  return (
    <div className="space-y-3">
      <CommentInput post={post} />
      {hasNextPage && (
        <Button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          variant="link"
          className="mx-auto block"
        >
          {isFetchingNextPage ? "Cargando..." : "Cargar más comentarios"}
        </Button>
      )}
      {status === "pending" && (
        <div className="flex justify-center">
          <Loader2 className="h-4 w-4 animate-spin" />
        </div>
      )}
      {status === "success" && comments?.length === 0 && (
        <div className="flex justify-center">
          <p className="text-muted-foreground text-sm">No hay comentarios</p>
        </div>
      )}
      {status === "error" && (
        <div className="flex justify-center">
          <p className="text-muted-foreground text-sm">
            Error al cargar los comentarios
          </p>
        </div>
      )}
      <div className="divide-y">
        {comments?.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
}
