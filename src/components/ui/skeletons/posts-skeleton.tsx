import { Skeleton } from "../skeleton";

function PostSkeleton() {
  return (
    <div className="bg-card w-full animate-pulse space-y-3 rounded-lg p-4 shadow-sm">
      <div className="flex flex-wrap gap-3">
        <Skeleton className="size-12 rounded-full" />
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-24 rounded-sm" />
          <Skeleton className="h-4 w-20 rounded-sm" />
        </div>
      </div>
      <Skeleton className="h-4 w-full rounded-sm" />
      <Skeleton className="h-4 w-full rounded-sm" />
      <Skeleton className="h-4 w-1/3 rounded-sm" />
    </div>
  );
}

export default function PostsSkeleton() {
  return (
    <div className="space-y-5">
      {[...Array(3)].map((_, index) => (
        <PostSkeleton key={index} />
      ))}
    </div>
  );
}
