import { cn } from "@/lib/utils";
import { Eye, EyeClosed } from "lucide-react";
import { forwardRef, useState } from "react";
import { Input } from "./ui/input";

const PasswordInput = forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, ...rest }, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Input
        ref={ref}
        type={showPassword ? "text" : "password"}
        className={cn("pe-10", className)}
        {...rest}
      />
      <button
        type="button"
        className="text-muted-foreground hover:text-primary focus:ring-primary absolute top-1/2 right-2 -translate-y-1/2 rounded-full p-1 transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:pointer-events-none"
        onClick={() => setShowPassword((prev) => !prev)}
        disabled={rest.disabled}
        aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
        aria-live="polite"
      >
        {showPassword ? (
          <Eye className="text-muted-foreground size-4" />
        ) : (
          <EyeClosed className="text-muted-foreground size-4" />
        )}
      </button>
    </div>
  );
});

PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
