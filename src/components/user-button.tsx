"use client";

import { useSession } from "@/app/(main)/session-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import UserAvatar from "./user-avatar";
import { DropdownMenuLabel } from "@radix-ui/react-dropdown-menu";
import Link from "next/link";
import {
  CheckSquare2,
  LogOut,
  Monitor,
  Moon,
  Sun,
  UserIcon,
} from "lucide-react";
import { logout } from "@/app/(auth)/actions";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import { Skeleton } from "./ui/skeleton";
import { useQueryClient } from "@tanstack/react-query";
import ThemeSwitcherSkeleton from "./ui/skeletons/theme-switcher-skeleton";
const ThemeSwitch = dynamic(() => import("./theme-switch"), { ssr: false });
interface UserButtonProps {
  className?: string;
}

export default function UserButton({ className }: UserButtonProps) {
  const { user } = useSession();

  const { theme } = useTheme();
  const queryClient = useQueryClient();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={className} asChild>
        <button className={cn("flex-none rounded-full", className)}>
          <UserAvatar avatarUrl={user.avatarUrl} size={40} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 p-2">
        <DropdownMenuLabel>
          Sesión iniciada como @{user.username}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href={`/users/${user.username}`}>
          <DropdownMenuItem className="cursor-pointer">
            <UserIcon className="mr-2 size-4" />
            Mi perfil
          </DropdownMenuItem>
        </Link>
        <Suspense fallback={<ThemeSwitcherSkeleton />}>
          <ThemeSwitch />
        </Suspense>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="hover:text-red-600"
          onClick={() => {
            queryClient.clear();
            logout();
          }}
        >
          <span className="flex items-center text-red-500">
            <LogOut className="mr-2 size-4 text-red-500" />
            Cerrar sesión
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
