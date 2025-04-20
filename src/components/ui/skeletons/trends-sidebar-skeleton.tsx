import { Skeleton } from "../skeleton";

export default function TrendsSidebarSkeleton() {
  return (
    <div className="bg-card flex flex-col gap-3 rounded-lg p-4 shadow-sm">
      <h2 className="text-lg font-bold">¿A quién seguir?</h2>
      {[...Array(2)].map((_, index) => (
        <div key={index} className="flex items-center gap-3">
          <Skeleton className="bg-muted h-10 w-10 rounded-full" />
          <div className="flex flex-col gap-3">
            <Skeleton className="bg-muted h-4 w-32 rounded-sm" />
            <Skeleton className="bg-muted h-4 w-24 rounded-sm" />
          </div>
        </div>
      ))}
    </div>
  );
}
