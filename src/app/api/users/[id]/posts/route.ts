import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { FollowerInfo, getPostDataInclude, PostPage } from "@/lib/types";
import { validateRequest } from "@/auth";

interface Params {
  id: string;
}

export async function GET(req: NextRequest, { params }: { params: Params }) {
  const { id } = await params;
  try {
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;
    const pageSize = 10;
    console.log("cursor", cursor);

    const { user: loggedUser } = await validateRequest();
    if (!loggedUser)
      return Response.json({ error: "Unauthorized" }, { status: 401 });

    const posts = await prisma.post.findMany({
      include: getPostDataInclude(loggedUser.id),
      where: { published: true, userId: id },
      orderBy: { createdAt: "desc" },
      take: pageSize + 1,
      cursor: cursor ? { id: cursor } : undefined,
    });

    const nextCursor = posts.length > pageSize ? posts[pageSize]?.id : null;

    const data: PostPage = {
      posts: posts.slice(0, pageSize),
      nextCursor,
    };

    return Response.json(data);
  } catch (error) {
    return Response.json(
      { error: "Error obteniendo los posts" },
      { status: 500 },
    );
  }
}
