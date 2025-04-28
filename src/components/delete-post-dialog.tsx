import { PostData } from "@/lib/types";
import LoadingButton from "./loading-button";
import { useDeletePostMutation } from "./posts/mutations";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

interface DeletePostDialogProps {
  post: PostData;
  open: boolean;
  onClose: () => void;
}

export default function DeletePostDialog({
  post,
  open,
  onClose,
}: DeletePostDialogProps) {
  const mutation = useDeletePostMutation(post);

  function handleOpen(isOpen: boolean) {
    if (!isOpen || mutation.isPending) {
      onClose();
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-destructive flex items-center gap-2">
            Eliminar publicación
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>
          ¿Estás seguro de que deseas eliminar esta publicación? Esta acción no
          se puede deshacer.
        </DialogDescription>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={mutation.isPending}
          >
            Cancelar
          </Button>
          <LoadingButton
            loading={mutation.isPending}
            variant="destructive"
            onClick={() => mutation.mutate(post.id, { onSuccess: onClose })}
          >
            Eliminar
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
