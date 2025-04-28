import { PostData, PostPage } from "@/lib/types";
import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { deletePost } from "./actions";
import { toast } from "sonner";
import { usePathname, useRouter } from "next/navigation";

export function useDeletePostMutation(post: PostData) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();

  const mutation = useMutation({
    mutationFn: deletePost,
    onSuccess: async () => {
      const queryFilter: QueryFilters = {
        queryKey: ["post-feed"],
      };

      await queryClient.cancelQueries(queryFilter);

      queryClient.setQueriesData<InfiniteData<PostPage, string | null>>(
        queryFilter,
        (oldData) => {
          if (!oldData) return oldData;

          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) => ({
              ...page,
              posts: page.posts.filter((p) => p.id !== post.id),
            })),
          };
        },
      );

      toast.success("Publicación eliminada", {
        description: "Tu publicación ha sido eliminada con éxito.",
      });

      if (pathname === `/p/${post.id}`) {
        router.push(`/u/${post.user.username}`);
      }
    },
    onError: (error) => {
      console.error(error);
      toast.error("Error al eliminar la publicación", {
        description: "Por favor, inténtalo de nuevo más tarde.",
      });
    },
  });

  return mutation;
}
