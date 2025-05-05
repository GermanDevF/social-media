"use client";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import UserAvatar from "@/components/user-avatar";
import useDebounce from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Check, Inbox, Loader2, SearchIcon, X } from "lucide-react";
import { useState } from "react";
import { UserResponse } from "stream-chat";
import { DefaultStreamChatGenerics, useChatContext } from "stream-chat-react";
import { useSession } from "../session-provider";
import { toast } from "sonner";
import LoadingButton from "@/components/loading-button";

interface NewChatDialogProps {
  onOpenChange: (open: boolean) => void;
  onChatCreated: () => void;
}

export default function NewChatDialog({
  onOpenChange,
  onChatCreated,
}: NewChatDialogProps) {
  const { client, setActiveChannel } = useChatContext();

  const { user: loggedInUser } = useSession();

  const [search, setSearch] = useState("");

  const searchDebounced = useDebounce(search, 500);

  const [selectedUsers, setSelectedUsers] = useState<
    UserResponse<DefaultStreamChatGenerics>[]
  >([]);

  const [users, setUsers] = useState<UserResponse<DefaultStreamChatGenerics>[]>(
    [],
  );

  const { data, isFetching, isError, isSuccess } = useQuery({
    queryKey: ["stream-chat-users", searchDebounced],
    queryFn: async () =>
      client.queryUsers(
        {
          name: searchDebounced,
          id: {
            $ne: loggedInUser.id,
          },
          role: { $ne: "admin" },
          ...(searchDebounced
            ? {
                $or: [
                  {
                    name: {
                      $autocomplete: searchDebounced,
                    },
                  },
                  {
                    username: {
                      $autocomplete: searchDebounced,
                    },
                  },
                ],
              }
            : {}),
        },
        { name: 1, username: 1 },
        { limit: 15 },
      ),
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const channel = await client.channel("messaging", {
        members: [...selectedUsers.map((user) => user.id), loggedInUser.id],
        name:
          selectedUsers.length > 1
            ? new Intl.ListFormat("es", {
                style: "long",
                type: "conjunction",
              }).format([
                loggedInUser.displayName,
                ...selectedUsers
                  .map((user) => user.name)
                  .filter((name): name is string => !!name),
              ])
            : undefined,
      });
      await channel.create();
      return channel;
    },
    onSuccess: (channel) => {
      setActiveChannel(channel);
      onChatCreated();
      onOpenChange(false);
    },
    onError: (error) => {
      console.error(error);
      toast.error("Error al crear el chat. Intenta nuevamente.");
    },
  });

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent className="dark:bg-card bg-auto p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>Nuevo chat</DialogTitle>
        </DialogHeader>
        <div>
          <div className="group relative">
            <SearchIcon className="text-muted-foreground group-focus-within:text-primary absolute top-1/2 left-5 size-5 -translate-y-1/2 transform" />
            <input
              placeholder="Buscar usuario..."
              className={cn(
                "dark:bg-background h-12 w-full ps-14 pe-4 focus:outline-none",
              )}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {!!selectedUsers.length && (
            <div className="flex flex-wrap gap-2 p-2">
              {selectedUsers.map((user) => (
                <SelectedUserTag
                  key={user.id}
                  user={user}
                  onRemove={() => {
                    setSelectedUsers((prev) =>
                      prev.filter((u) => u.id !== user.id),
                    );
                  }}
                />
              ))}
            </div>
          )}
          <hr />
          <div className="h-96 overflow-y-auto">
            {isSuccess &&
              data.users.map((user) => (
                <UserResult
                  key={user.id}
                  user={user}
                  selected={selectedUsers.includes(user)}
                  onClick={() => {
                    setSelectedUsers((prev) =>
                      prev.some((u) => u.id === user.id)
                        ? prev.filter((u) => u.id !== user.id)
                        : [...prev, user],
                    );
                  }}
                />
              ))}
            {isSuccess && !data.users.length && (
              <div className="flex h-full flex-col items-center justify-center">
                <Inbox className="text-muted-foreground size-10" />
                <p className="text-muted-foreground">
                  No se encontraron usuarios
                </p>
              </div>
            )}
            {isFetching && (
              <div className="flex h-full flex-col items-center justify-center">
                <Loader2 className="text-muted-foreground size-10 animate-spin" />
                <p className="text-muted-foreground">Buscando usuarios...</p>
              </div>
            )}
            {isError && (
              <div className="flex h-full flex-col items-center justify-center">
                <X className="text-muted-foreground size-10" />
                <p className="text-muted-foreground">
                  Error al buscar usuarios
                </p>
              </div>
            )}
          </div>
        </div>
        <DialogFooter className="px-6 pb-6">
          <LoadingButton
            loading={mutation.isPending}
            onClick={() => mutation.mutate()}
            disabled={!selectedUsers.length}
          >
            Crear chat
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface UserResultProps {
  user: UserResponse<DefaultStreamChatGenerics>;
  selected: boolean;
  onClick: () => void;
}

function UserResult({ user, selected, onClick }: UserResultProps) {
  return (
    <button
      className="hover:bg-muted/50 flex w-full items-center justify-between px-4 py-2.5 transition-colors"
      onClick={onClick}
    >
      <div className="flex items-center gap-2">
        <UserAvatar avatarUrl={user.image} />
        <div className="flex flex-col text-start">
          <p className="font-bold">{user.name}</p>
          <p className="text-muted-foreground">@{user.username}</p>
        </div>
      </div>
      {selected && <Check className="size-5 text-green-500" />}
    </button>
  );
}

interface SelectedUserTagProps {
  user: UserResponse<DefaultStreamChatGenerics>;
  onRemove: () => void;
}

function SelectedUserTag({ user, onRemove }: SelectedUserTagProps) {
  return (
    <button
      onClick={onRemove}
      className="hover:bg-muted/50 flex items-center gap-2 rounded-full border p-1"
    >
      <UserAvatar avatarUrl={user.image} size={24} />
      <p className="font-bold">{user.name}</p>
      <X className="text-muted-foreground mx-2 size-5" />
    </button>
  );
}
