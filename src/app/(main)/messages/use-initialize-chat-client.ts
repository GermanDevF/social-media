import kyInstance from "@/lib/ky";
import { useEffect, useState } from "react";
import { StreamChat } from "stream-chat";
import { useSession } from "../session-provider";

export default function useInitializeChatClient() {
  const { user } = useSession();
  const [chatClient, setChatClient] = useState<StreamChat | null>(null);

  useEffect(() => {
    if (!user) return;

    const chatClient = StreamChat.getInstance(
      process.env.NEXT_PUBLIC_STREAM_KEY!,
    );

    chatClient
      .connectUser(
        {
          id: user.id,
          username: user.username,
          name: user.displayName,
          image: user.avatarUrl,
        },
        async () =>
          kyInstance
            .get("/api/get-token")
            .json<{ token: string }>()
            .then((res) => res.token),
      )
      .catch((error) => {
        console.error("Error connecting to chat client", error);
      })
      .then(() => {
        setChatClient(chatClient);
      });

    return () => {
      setChatClient(null);
      chatClient
        ?.disconnectUser()
        .catch((error) => {
          console.error("Error disconnecting from chat client", error);
        })
        .then(() => {
          console.log("Disconnected from chat client");
        });
    };
  }, [user, user?.id, user?.username, user?.displayName, user?.avatarUrl]);

  return chatClient;
}
