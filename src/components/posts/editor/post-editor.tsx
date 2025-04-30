"use client";
import { useSession } from "@/app/(main)/session-provider";
import LoadingButton from "@/components/loading-button";
import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/user-avatar";
import { cn } from "@/lib/utils";
import PlaceHolder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { ImageIcon, Loader2, SendHorizontal, XIcon } from "lucide-react";
import Image from "next/image";
import { ClipboardEvent, useRef } from "react";
import { useSubmitPostMutation } from "./mutations";
import "./styles.css";
import useMediaUpload, { Attachment } from "./use-media-upload";
import { useDropzone } from "@uploadthing/react";

export default function PostEditor() {
  const mutation = useSubmitPostMutation();

  const { user } = useSession();

  const {
    attachments,
    startUpload,
    deleteAttachment,
    reset: resetAttachments,
    isUploading,
    uploadProgress,
  } = useMediaUpload();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      startUpload(acceptedFiles);
    },
    accept: {
      "image/*": [".png", ".jpg", ".jpeg"],
      "video/*": [".mp4"],
    },
  });

  const { onClick: _, ...rootProps } = getRootProps();

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
        mediaIds: attachments.map((a) => a.mediaId).filter(Boolean) as string[],
      },
      {
        onSuccess: () => {
          editor?.commands.clearContent();
          resetAttachments();
        },
      },
    );
  }

  function onPaste(event: ClipboardEvent<HTMLDivElement>) {
    const files = Array.from(event.clipboardData.files);
    if (files.length) {
      startUpload(files);
    }
  }

  return (
    <div className="bg-card flex flex-col gap-5 rounded-lg p-4 shadow-sm">
      <div className="flex gap-5">
        <UserAvatar avatarUrl={user?.avatarUrl} className="hidden sm:inline" />
        <div {...rootProps} className="w-full">
          <EditorContent
            editor={editor}
            className={cn(
              "bg-primary/15 max-h-[20rem] w-full overflow-y-auto rounded-md px-4 py-2",
              isDragActive && "outline-primary outline outline-dashed",
            )}
            onPaste={onPaste}
          />
        </div>
        <input {...getInputProps()} />
      </div>
      {attachments.length > 0 && (
        <AttachmentList attachments={attachments} onRemove={deleteAttachment} />
      )}
      <div className="flex items-center justify-end gap-2">
        {isUploading && (
          <div className="flex items-center gap-2">
            <p className="text-muted-foreground text-sm">{uploadProgress}%</p>
            <Loader2 className="size-4 animate-spin" />
          </div>
        )}
        <AddAttachmentButton
          onFilesSelected={startUpload}
          disabled={attachments.length > 5 || isUploading}
        />
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

interface AddAttachmentButtonProps {
  onFilesSelected: (files: File[]) => void;
  disabled?: boolean;
}

function AddAttachmentButton({
  onFilesSelected,
  disabled,
}: AddAttachmentButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="text-primary hover:text-primary"
        onClick={() => inputRef.current?.click()}
        disabled={disabled}
      >
        <ImageIcon className="size-8" />
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*, video/*"
        multiple
        className="sr-only hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files || []);
          if (files.length) {
            onFilesSelected(files);
            e.target.value = "";
          }
        }}
      />
    </>
  );
}

interface AttachmentListProps {
  attachments: Attachment[];
  onRemove: (filename: string) => void;
}

function AttachmentList({ attachments, onRemove }: AttachmentListProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap gap-2",
        attachments.length > 1 && "sm:grid sm:grid-cols-2",
      )}
    >
      {attachments.map((attachment) => (
        <AttachmentPreview
          key={attachment.mediaId}
          attachment={attachment}
          onRemove={() => onRemove(attachment.file.name)}
        />
      ))}
    </div>
  );
}

interface AttachmentPreviewProps {
  attachment: Attachment;
  onRemove: () => void;
}

function AttachmentPreview({
  attachment: { file, isUploading },
  onRemove,
}: AttachmentPreviewProps) {
  const src = URL.createObjectURL(file);

  return (
    <div
      className={cn("relative mx-auto size-fit", isUploading && "opacity-50")}
    >
      {file.type.startsWith("image") ? (
        <Image
          src={src}
          alt="attachment preview"
          width={500}
          height={500}
          className="size-fit max-h-[30rem] rounded-lg"
        />
      ) : (
        <video className="size-fit max-h-[30rem] rounded-lg" controls>
          <source src={src} type={file.type} />
        </video>
      )}
      {!isUploading && (
        <Button
          variant="ghost"
          size="icon"
          className="bg-foreground text-background hover:bg-foreground/80 absolute top-3 right-3 rounded-full p-1.5 transition-colors"
          onClick={onRemove}
        >
          <XIcon className="size-4" />
        </Button>
      )}
    </div>
  );
}
