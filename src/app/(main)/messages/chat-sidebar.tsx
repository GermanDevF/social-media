import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { MailPlus, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
  ChannelList,
  ChannelPreviewMessenger,
  ChannelPreviewUIComponentProps,
  useChatContext,
} from "stream-chat-react";
import { useSession } from "../session-provider";
import NewChatDialog from "./new-chat-dialog";

interface ChatSidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function ChatSidebar({ open, onClose }: ChatSidebarProps) {
  const { user } = useSession();

  const queryClient: QueryClient = useQueryClient();

  const { channel } = useChatContext();

  useEffect(() => {
    if (channel?.id) {
      queryClient.invalidateQueries({
        queryKey: ["unread-messages-count"],
      });
    }
  }, [channel, queryClient]);

  const ChannelPreviewCustom = useCallback(
    (props: ChannelPreviewUIComponentProps) => (
      <ChannelPreviewMessenger
        {...props}
        onSelect={() => {
          props.setActiveChannel?.(props.channel, props.watchers);
          onClose();
        }}
      />
    ),
    [onClose],
  );

  return (
    <div
      className={cn(
        "size-full flex-col border-e md:flex md:w-72",
        open ? "flex" : "hidden",
      )}
    >
      <MenuHeader onClose={onClose} />
      <ChannelList
        filters={{
          type: "messaging",
          members: { $in: [user?.id] },
        }}
        showChannelSearch
        options={{
          state: true,
          presence: true,
          limit: 8,
        }}
        sort={[{ last_message_at: -1 }]}
        additionalChannelSearchProps={{
          placeholder: "Buscar chats...",
          searchForChannels: true,
          searchQueryParams: {
            channelFilters: {
              filters: {
                members: { $in: [user?.id] },
              },
            },
          },
        }}
        Preview={ChannelPreviewCustom}
      />
    </div>
  );
}

interface MenuHeaderProps {
  onClose: () => void;
}

function MenuHeader({ onClose }: MenuHeaderProps) {
  const [newChatDialogOpen, setNewChatDialogOpen] = useState(false);
  return (
    <>
      <div className="flex items-center justify-between gap-3 px-4 py-2">
        <div className="h-full md:hidden">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="size-5" />
          </Button>
        </div>
        <h1 className="text-xl font-semibold">Mensajes</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setNewChatDialogOpen(true)}
          title="Nuevo chat"
        >
          <MailPlus className="size-5" />
        </Button>
      </div>
      {newChatDialogOpen && (
        <NewChatDialog
          onOpenChange={setNewChatDialogOpen}
          onChatCreated={() => {
            setNewChatDialogOpen(false);
            onClose();
          }}
        />
      )}
    </>
  );
}
