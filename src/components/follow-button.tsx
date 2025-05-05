"use client";

import useFollowerInfo from "@/hooks/use-follower-info";
import kyInstance from "@/lib/ky";
import { FollowerInfo } from "@/lib/types";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "./ui/button";

interface FollowButtonProps {
  userId: string;
  initialState: FollowerInfo;
}

export default function FollowButton({
  userId,
  initialState,
}: FollowButtonProps) {
  const { data } = useFollowerInfo(userId, initialState);
  const queryClient = useQueryClient();
  const queryKey: QueryKey = ["follower-info", userId];

  const { mutate } = useMutation({
    mutationFn: (isFollowedByUser: boolean) =>
      isFollowedByUser
        ? kyInstance.delete(`/api/users/${userId}/followers`)
        : kyInstance.post(`/api/users/${userId}/followers`),
    onMutate: async (isFollowedByUser: boolean) => {
      await queryClient.cancelQueries({ queryKey });

      const previousState = queryClient.getQueryData<FollowerInfo>(queryKey);

      queryClient.setQueryData<FollowerInfo>(queryKey, () => ({
        followers:
          (previousState?.followers || 0) + (isFollowedByUser ? -1 : 1),
        isFollowedByUser: !isFollowedByUser,
      }));

      return { previousState };
    },
    onError: (error, _, context) => {
      queryClient.setQueryData(queryKey, context?.previousState);

      toast.error("Error al seguir o dejar de seguir al usuario");
      console.error("Error following/unfollowing user:", error);
    },
  });

  const handleFollowToggle = () => {
    if (!data) return;
    mutate(data.isFollowedByUser);
  };

  if (!data) {
    return <Button disabled>Cargando...</Button>;
  }

  return (
    <Button
      variant={data.isFollowedByUser ? "secondary" : "default"}
      onClick={handleFollowToggle}
      aria-label={data.isFollowedByUser ? "Dejar de seguir" : "Seguir"}
    >
      {data.isFollowedByUser ? <>Siguiendo</> : <>Seguir</>}
    </Button>
  );
}
