import * as React from "react"

import { cn } from "@/lib/utils"
import { X } from "lucide-react";
import { Button } from "./button";

type InputProps = React.ComponentProps<"input"> & {
  clearable?: boolean;
};

function Input({ className, type, clearable = false, ...props }: InputProps) {
  return (
    <div className="relative">
      <input
        type={type}
        data-slot="input"
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          className,
        )}
        {...props}
      />
      {/* Clear button */}
      {clearable && props.value && (
        <Button
          variant="link"
          size="icon"
          className="absolute top-1/2 right-2 z-10 -translate-y-1/2"
          onClick={() => {
            const event = new Event("input", { bubbles: true });
            const input = document.querySelector(
              'input[data-slot="input"]',
            ) as HTMLInputElement;
            if (input) {
              input.value = "";
              input.dispatchEvent(event);
              props.onChange?.(
                event as unknown as React.ChangeEvent<HTMLInputElement>,
              );
            }
          }}
        >
          <X className="size-4" />
        </Button>
      )}
    </div>
  );
}

export { Input }
