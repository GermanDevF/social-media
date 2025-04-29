import { useUploadThing } from "@/lib/uploadthing";
import { useState } from "react";
import { toast } from "sonner";

export interface Attachment {
  file: File;
  mediaId?: string;
  isUploading: boolean;
  error?: string;
}

export default function useMediaUpload() {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const { startUpload, isUploading } = useUploadThing("attachment", {
    onBeforeUploadBegin(files) {
      // Verificar límite de archivos
      if (attachments.length + files.length > 5) {
        toast.error("No se puede subir más de 5 archivos por publicación.");
        return [];
      }

      // Verificar tipos de archivo
      const validFiles = files.filter((file) => {
        const isValid =
          file.type.startsWith("image/") || file.type.startsWith("video/");
        if (!isValid) {
          toast.error(`Tipo de archivo no soportado: ${file.name}`);
        }
        return isValid;
      });

      const renamedFiles = validFiles.map((file) => {
        const extension = file.name.split(".").pop();
        return new File(
          [file],
          `attachment_${crypto.randomUUID()}.${extension}`,
          { type: file.type },
        );
      });

      setAttachments((prev) => [
        ...prev,
        ...renamedFiles.map((file) => ({
          file,
          isUploading: true,
          error: undefined,
        })),
      ]);

      return renamedFiles;
    },
    onUploadProgress: (progress) => {
      setUploadProgress(progress);
    },
    onClientUploadComplete: (result) => {
      setAttachments((prev) =>
        prev.map((attachment) => {
          const uploadResult = result.find(
            (r) => r.name === attachment.file.name,
          );

          if (!uploadResult) {
            return {
              ...attachment,
              isUploading: false,
              error: "Error al subir el archivo",
            };
          }

          return {
            ...attachment,
            mediaId: uploadResult.serverData.mediaId,
            isUploading: false,
            error: undefined,
          };
        }),
      );
    },
    onUploadError: (error) => {
      setAttachments((prev) =>
        prev.map((attachment) =>
          attachment.isUploading
            ? { ...attachment, isUploading: false, error: error.message }
            : attachment,
        ),
      );

      toast.error("Error al subir el archivo", {
        description: error.message,
      });
    },
  });

  function handleStartUpload(files: File[]) {
    if (isUploading) {
      toast.error("Por favor, espere a que se complete la carga en curso...");
      return;
    }

    startUpload(files);
  }

  function handleDeleteAttachment(filename: string) {
    setAttachments((prev) => prev.filter((a) => a.file.name !== filename));
  }

  function reset() {
    setAttachments([]);
    setUploadProgress(0);
  }

  return {
    startUpload: handleStartUpload,
    attachments,
    isUploading,
    uploadProgress,
    deleteAttachment: handleDeleteAttachment,
    reset,
  };
}
