import { CheckSquare2, Monitor, Moon, Sun } from "lucide-react";
import {
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "./ui/dropdown-menu";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeSwitch() {
  const { theme, setTheme } = useTheme();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        {theme === "dark" && <Moon className="mr-4 size-4" />}
        {theme === "light" && <Sun className="mr-4 size-4" />}
        {theme === "system" && <Monitor className="mr-4 size-4" />}
        Tema
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent>
          <DropdownMenuItem onClick={() => setTheme("system")}>
            <Monitor className="mr-2 size-4" />
            <span className="flex-1">Sistema</span>
            {theme === "system" && (
              <span className="absolute right-2">
                <CheckSquare2 className="text-primary size-4" />
              </span>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")}>
            <Moon className="mr-2 size-4" />
            <span className="flex-1">Oscuro</span>
            {theme === "dark" && (
              <span className="absolute right-2">
                <CheckSquare2 className="text-primary size-4" />
              </span>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("light")}>
            <Sun className="mr-2 size-4" />
            <span className="flex-1">Claro</span>
            {theme === "light" && (
              <span className="absolute right-2">
                <CheckSquare2 className="text-primary size-4" />
              </span>
            )}
          </DropdownMenuItem>
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  );
}
