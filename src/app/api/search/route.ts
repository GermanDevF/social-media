import { validateRequest } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getPostDataInclude, PostPage } from "@/lib/types";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const q = req.nextUrl.searchParams.get("q") || "";
    const cursor = req.nextUrl.searchParams.get("cursor") || "";

    const searchQuery = q.split(" ").join(" & ");

    const pageSize = 10;
    const posts = await prisma.post.findMany({
      where: {
        OR: [
          { content: { search: searchQuery, mode: "insensitive" } },
          {
            user: {
              displayName: {
                search: searchQuery,
                mode: "insensitive",
              },
            },
          },
        ],
        published: true,
      },
      include: getPostDataInclude(user.id),
      orderBy: { createdAt: "desc" },
      take: pageSize + 1,
      cursor: cursor ? { id: cursor } : undefined,
    });

    const data: PostPage = {
      posts: posts.slice(0, pageSize),
      nextCursor: posts.length > pageSize ? posts[pageSize]?.id : null,
    };

    return Response.json(data);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
