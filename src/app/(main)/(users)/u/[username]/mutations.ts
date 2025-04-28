"use client";
import { InfiniteData, QueryFilters, useMutation } from "@tanstack/react-query";
import { useUploadThing } from "@/lib/uploadthing";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { UpdateUserValues } from "@/lib/validations";
import { updateUser } from "./actions";
import { PostPage } from "@/lib/types";

export function useUpdateProfileMutation() {
  const router = useRouter();

  const queryClient = useQueryClient();

  const { startUpload: startAvatarUpload } = useUploadThing("avatar");

  const mutation = useMutation({
    mutationFn: async ({
      values,
      avatar,
    }: {
      values: UpdateUserValues;
      avatar?: File;
    }) => {
      const [updatedUser, avatarResult] = await Promise.all([
        updateUser(values),
        avatar ? startAvatarUpload([avatar]) : Promise.resolve([]),
      ]);

      return { updatedUser, avatarResult };
    },
    onSuccess: async ({ updatedUser, avatarResult }) => {
      const newAvatarUrl = avatarResult?.[0]?.url;

      if (newAvatarUrl && updatedUser) {
        const queryFilter: QueryFilters = {
          queryKey: ["post-feed"],
        };

        await queryClient.cancelQueries(queryFilter);

        queryClient.setQueriesData<InfiniteData<PostPage, string | null>>(
          queryFilter,
          (oldData) => {
            if (!oldData) return;

            return {
              pageParams: oldData.pageParams,
              pages: oldData.pages.map((page) => ({
                nextCursor: page.nextCursor,
                posts: page.posts.map((post) => {
                  if (post.user.id === updatedUser.id) {
                    return {
                      ...post,
                      user: {
                        ...updatedUser,
                        avatarUrl: newAvatarUrl || updatedUser.avatarUrl,
                      },
                    };
                  }
                  return post;
                }),
              })),
            };
          },
        );
        toast.success("Foto de perfil actualizada");
      } else {
        toast.success("Perfil actualizado");
      }
      router.refresh();
    },
    onError: (error) => {
      console.error(error);
      toast.error("Error al actualizar la foto de perfil");
    },
  });

  return mutation;
}
