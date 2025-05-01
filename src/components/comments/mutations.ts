import { InfiniteData, QueryKey, useMutation } from "@tanstack/react-query";

import { CommentPage } from "@/lib/types";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteComment, submitComment } from "./actions";

export function useSubmitCommentMutation(postId: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: submitComment,
    onSuccess: async (newComment) => {
      const queryKey: QueryKey = ["comments", postId];

      await queryClient.cancelQueries({ queryKey });

      queryClient.setQueryData<InfiniteData<CommentPage, string | null>>(
        queryKey,
        (oldData) => {
          const firstPage = oldData?.pages[0];

          if (firstPage) {
            return {
              pageParams: oldData.pageParams,
              pages: [
                {
                  comments: [...firstPage.comments, newComment],
                  previousCursor: firstPage.previousCursor,
                },
                ...oldData.pages.slice(1),
              ],
            };
          }
        },
      );

      queryClient.invalidateQueries({
        queryKey,
        predicate: (query) => {
          return !query.state.data;
        },
      });

      toast.success("Comentario creado", {
        description: "Tu comentario ha sido creado con éxito.",
        icon: "💬",
      });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Error al crear el comentario", {
        description: "Por favor, inténtalo de nuevo más tarde.",
      });
    },
  });

  return mutation;
}

export function useDeleteCommentMutation() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteComment,
    onSuccess: async (deletedComment) => {
      const queryKey: QueryKey = ["comments", deletedComment.id];

      // queryClient.invalidateQueries({ queryKey });

      await queryClient.cancelQueries({ queryKey });

      queryClient.setQueryData<InfiniteData<CommentPage, string | null>>(
        queryKey,
        (oldData) => {
          if (!oldData) return undefined;

          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) => ({
              previousCursor: page.previousCursor,
              comments: page.comments.filter((c) => c.id !== deletedComment.id),
            })),
          };
        },
      );
      toast.success("Comentario eliminado", {
        description: "Tu comentario ha sido eliminado con éxito.",
        icon: "💬",
      });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Error al eliminar el comentario", {
        description: "Por favor, inténtalo de nuevo más tarde.",
      });
    },
  });

  return mutation;
}
