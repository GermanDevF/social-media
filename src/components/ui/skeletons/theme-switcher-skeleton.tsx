import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Skeleton } from "../skeleton";

export default function ThemeSwitcherSkeleton() {
  const { theme } = useTheme();
  return (
    <div className="flex h-8 items-center gap-2">
      {theme === "dark" && <Moon className="size-4" />}
      {theme === "light" && <Sun className="size-4" />}
      {theme === "system" && <Monitor className="size-4" />}
      <Skeleton className="w-full" />
    </div>
  );
}
