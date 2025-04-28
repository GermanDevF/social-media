import {
  generateReactHelpers,
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";

import type { FileRoute } from "@/app/api/uploadthing/core";

export const UploadButton = generateUploadButton<FileRoute>();
export const UploadDropzone = generateUploadDropzone<FileRoute>();

export const { useUploadThing, uploadFiles } =
  generateReactHelpers<FileRoute>();
