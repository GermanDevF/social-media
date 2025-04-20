import { validateRequest } from "@/auth";
import { prisma } from "@/lib/prisma";
import { userDataSelect } from "@/lib/types";
import UserAvatar from "./user-avatar";
import Link from "next/link";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "./ui/button";
import { unstable_cache } from "next/cache";
import { formatNumber } from "@/lib/utils";
import TrendsSidebarSkeleton from "./ui/skeletons/trends-sidebar-skeleton";

async function fetchUsersToFollow(userId: string) {
  return prisma.user.findMany({
    where: {
      NOT: { id: userId },
    },
    take: 5,
    select: userDataSelect,
  });
}

function UserCard({
  user,
}: {
  user: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl: string | null;
  };
}) {
  return (
    <div key={user.id} className="flex items-center justify-between gap-3">
      <Link href={`/u/${user.username}`} className="flex items-center gap-3">
        <UserAvatar avatarUrl={user.avatarUrl} className="flex-none" />
        <div>
          <p className="text-foreground line-clamp-1 font-semibold break-all hover:underline">
            {user.displayName}
          </p>
          <p className="text-muted-foreground line-clamp-1 break-all hover:underline">
            @{user.username}
          </p>
        </div>
      </Link>
      <Button>Seguir</Button>
    </div>
  );
}

async function WhoToFollow() {
  const { user } = await validateRequest();

  if (!user) return null;

  const usersToFollow = await fetchUsersToFollow(user.id);

  return (
    <div className="bg-card flex flex-col gap-3 rounded-lg p-4 shadow-sm">
      <h2 className="text-lg font-bold">¿A quién seguir?</h2>
      {usersToFollow.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
}

const getTrendingTopics = unstable_cache(
  async (userId: string) => {
    const result = await prisma.$queryRaw<{ hashtag: string; count: bigint }[]>`
    SELECT LOWER(unnest(regexp_matches(content, '#[[:alnum:]_]+', 'g'))) AS hashtag, COUNT(*) AS count
    FROM posts
    GROUP BY hashtag
    ORDER BY count DESC, hashtag ASC
    LIMIT 5
  `;
    return result.map((row) => ({
      hashtag: row.hashtag,
      count: Number(row.count),
    }));
  },
  ["trending-topics"],
  {
    revalidate: 60 * 60 * 3, // 3 hours
  },
);

async function TrendingTopics() {
  const trendingTopics = await getTrendingTopics("");

  return (
    <div className="bg-card space-y-5 rounded-lg p-4 shadow-sm">
      <div className="text-xl font-bold">Temas del momento</div>
      {trendingTopics.map(({ hashtag, count }) => {
        const title = hashtag.replace(/#/g, "");

        return (
          <Link
            key={title}
            href={`/explore?hashtag=${title}`}
            className="block"
          >
            <p
              className="line-clamp-1 font-semibold break-all hover:underline"
              title={hashtag}
            >
              {title}
            </p>
            <p className="text-muted-foreground line-clamp-1 break-all hover:underline">
              {formatNumber(count)}{" "}
              {count === 1 ? "publicación" : "publicaciones"}
            </p>
          </Link>
        );
      })}
    </div>
  );
}

export default function TrendsSidebar() {
  return (
    <div className="sticky top-0 hidden h-fit w-72 flex-none space-y-5 rounded-lg shadow-sm md:block lg:w-80">
      <Suspense fallback={<TrendsSidebarSkeleton />}>
        <WhoToFollow />
        <TrendingTopics />
      </Suspense>
    </div>
  );
}
