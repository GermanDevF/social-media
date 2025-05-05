"use client";
import useFollowerInfo from "@/hooks/use-follower-info";
import { FollowerInfo } from "@/lib/types";

interface FollowerCounterProps {
  userId: string;
  initialState: FollowerInfo;
}

export default function FollowerCounter({
  userId,
  initialState,
}: FollowerCounterProps) {
  const { data } = useFollowerInfo(userId, initialState);

  return (
    <div className="flex items-center gap-2">
      Seguidores
      <span className="text-sm font-semibold">{data.followers}</span>
    </div>
  );
}
