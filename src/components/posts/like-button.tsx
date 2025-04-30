import kyInstance from "@/lib/ky";
import { LikeInfo } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { toast } from "sonner";

interface LikeButtonProps {
  postId: string;
  initialState: LikeInfo;
}

export default function LikeButton({ postId, initialState }: LikeButtonProps) {
  const queryClient = useQueryClient();

  const queryKey: QueryKey = ["like-info", postId];

  const { data } = useQuery({
    queryKey,
    queryFn: () =>
      kyInstance.get(`/api/posts/${postId}/likes`).json<LikeInfo>(),
    initialData: initialState,
    staleTime: Infinity,
  });

  const { mutate } = useMutation({
    mutationFn: () =>
      data.isLikedByUser
        ? kyInstance.delete(`/api/posts/${postId}/likes`).json<LikeInfo>()
        : kyInstance.post(`/api/posts/${postId}/likes`).json<LikeInfo>(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["likes", postId] });
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });

      const previousState = queryClient.getQueryData<LikeInfo>(queryKey);

      queryClient.setQueryData<LikeInfo>(queryKey, () => ({
        likes: (previousState?.likes || 0) + (data.isLikedByUser ? -1 : 1),
        isLikedByUser: !data.isLikedByUser,
      }));

      return { previousState };
    },
    onError: (error, _, context) => {
      queryClient.setQueryData(queryKey, context?.previousState);

      toast.error("Algo salió mal, intenta nuevamente");
      console.error("Error liking/unliking post:", error);
    },
  });
  return (
    <button
      onClick={() => mutate()}
      className="flex cursor-pointer items-center gap-2"
    >
      <Heart
        className={cn(
          "size-5",
          data.isLikedByUser && "fill-red-500 text-red-500",
        )}
      />
      <span className="text-sm font-medium tabular-nums">
        {data.likes}{" "}
        <span className="hidden text-xs md:inline">
          {data.likes === 1 ? "Like" : "Likes"}
        </span>
      </span>
    </button>
  );
}
