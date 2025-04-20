import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { submitPost } from "./actions";
import { PostPage } from "@/lib/types";

export function useSubmitPostMutation() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: submitPost,
    onSuccess: async (post) => {
      const queryFilter: QueryFilters = {
        queryKey: ["post-feed", "for-you"],
      };

      await queryClient.cancelQueries(queryFilter);

      queryClient.setQueriesData<InfiniteData<PostPage, string | null>>(
        queryFilter,
        (oldData) => {
          const firstPage = oldData?.pages[0];

          if (firstPage) {
            return {
              pageParams: oldData.pageParams,
              pages: [
                {
                  posts: [post, ...firstPage.posts],
                  nextCursor: firstPage.nextCursor,
                },
                ...oldData.pages.slice(1),
              ],
            };
          }
        },
      );

      queryClient.invalidateQueries({
        queryKey: queryFilter.queryKey,
        predicate: (query) => {
          return !query.state.data;
        },
      });

      toast.success("Publicación creada", {
        description: "Tu publicación ha sido creada con éxito.",
      });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Error al crear la publicación", {
        description: "Por favor, inténtalo de nuevo más tarde.",
      });
    },
  });

  return mutation;
}
