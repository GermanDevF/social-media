"use client";
import { CommentData } from "@/lib/types";
import { useState } from "react";
import DeleteCommentDialog from "./delete-comment-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Button } from "../ui/button";
import { MoreHorizontal, Trash2 } from "lucide-react";

interface CommentMoreButtonProps {
  comment: CommentData;
  className?: string;
}

export default function CommentMoreButton({
  comment,
  className,
  ...props
}: CommentMoreButtonProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="ghost" className={className} {...props}>
            <MoreHorizontal className="size-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="text-destructive size-4" />
            <span className="text-destructive flex items-center gap-3">
              Eliminar comentario
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteCommentDialog
        comment={comment}
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
      />
    </>
  );
}
