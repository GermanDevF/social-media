import Image from "next/image";
import avatarPlaceHolder from "@/assets/avatar-placeholder.png";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  avatarUrl: string | null | undefined;
  size?: number;
  className?: string;
}

export default function UserAvatar({
  avatarUrl,
  size = 40,
  className = "rounded-full",
}: UserAvatarProps) {
  return (
    <Image
      src={avatarUrl || avatarPlaceHolder}
      alt="User avatar"
      width={size ?? 48}
      height={size ?? 48}
      className={cn(
        "bg-secondary aspect-square h-fit flex-none cursor-pointer rounded-full object-cover",
        className,
      )}
    />
  );
}
