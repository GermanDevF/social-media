"use client";
import { useSession } from "@/app/(main)/session-provider";
import LoadingButton from "@/components/loading-button";
import UserAvatar from "@/components/user-avatar";
import PlaceHolder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { SendHorizontal } from "lucide-react";
import { useSubmitPostMutation } from "./mutations";
import "./styles.css";

export default function PostEditor() {
  const mutation = useSubmitPostMutation();
  const { user } = useSession();
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bold: false,
        italic: false,
      }),
      PlaceHolder.configure({
        placeholder: "Escribe algo...",
        showOnlyCurrent: true,
      }),
    ],
  });

  const input =
    editor?.getText({
      blockSeparator: "\n",
    }) || "";

  async function handleSubmit() {
    mutation.mutate(
      {
        content: input,
      },
      {
        onSuccess: () => {
          editor?.commands.clearContent();
        },
      },
    );
  }

  return (
    <div className="bg-card flex flex-col gap-5 rounded-lg p-4 shadow-sm">
      <div className="flex gap-5">
        <UserAvatar avatarUrl={user?.avatarUrl} className="hidden sm:inline" />
        <EditorContent
          editor={editor}
          className="bg-primary/15 max-h-[20rem] w-full overflow-y-auto rounded-md px-4 py-2"
        />
      </div>
      <div className="flex justify-end">
        <LoadingButton
          onClick={handleSubmit}
          disabled={!input.trim()}
          loading={mutation.isPending}
        >
          {!mutation.isPending && <SendHorizontal />}
          {!mutation.isPending ? "Publicar" : "Publicando..."}
        </LoadingButton>
      </div>
    </div>
  );
}
