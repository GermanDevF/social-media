import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="text-primary h-12 w-12 animate-spin" />
    </div>
  );
}
