import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "./ui/button";
import { Loader2 } from "lucide-react";
import { VariantProps } from "class-variance-authority";

export default function LoadingButton({
  loading,
  disabled,
  className,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    loading: boolean;
  }) {
  return (
    <Button
      disabled={disabled || loading}
      className={cn("flex items-center gap-2", className)}
      {...props}
    >
      {loading && <Loader2 className="size-5 animate-spin" />}
      {props.children}
    </Button>
  );
}
