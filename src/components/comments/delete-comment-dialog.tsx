import { CommentData } from "@/lib/types";
import { useDeleteCommentMutation } from "./mutations";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "../ui/dialog";
import LoadingButton from "../loading-button";

interface DeleteCommentDialogProps {
  comment: CommentData;
  open: boolean;
  onClose: () => void;
}

export default function DeleteCommentDialog({
  comment,
  open,
  onClose,
}: DeleteCommentDialogProps) {
  const { mutate: deleteComment, isPending } = useDeleteCommentMutation();

  function handleOpenChange(open: boolean) {
    if (!open || !isPending) {
      onClose();
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar comentario</DialogTitle>
          <DialogDescription>
            Estás seguro de querer eliminar este comentario?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <LoadingButton
            variant="destructive"
            onClick={() =>
              deleteComment(comment.id, {
                onSuccess: () => {
                  onClose();
                },
              })
            }
            loading={isPending}
          >
            {isPending ? "Eliminando..." : "Eliminar"}
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
