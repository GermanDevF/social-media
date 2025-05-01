import { PostData } from "@/lib/types";
import { Loader2, SendHorizontal } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useSubmitCommentMutation } from "./mutations";

interface CommentInputProps {
  post: PostData;
}

export default function CommentInput({ post }: CommentInputProps) {
  const [input, setInput] = useState("");

  const { mutate: submitComment, isPending } = useSubmitCommentMutation(
    post.id,
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!input.trim()) return;

    submitComment({
      content: input,
      post,
    });

    setInput("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full items-center gap-2">
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Añadir comentario..."
        className="rounded-lg"
        autoFocus
      />
      <Button type="submit" disabled={isPending}>
        {isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <SendHorizontal className="size-4" />
        )}
      </Button>
    </form>
  );
}
