import { validateRequest } from "@/auth";
import { prisma } from "@/lib/prisma";
import { CommentPage, getCommentDataInclude } from "@/lib/types";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { user } = await validateRequest();

    if (!user) return new Response("Unauthorized", { status: 401 });

    const { id } = await params;

    const cursor = request.nextUrl.searchParams.get("cursor") || undefined;

    const pageSize = 5;

    const comments = await prisma.comment.findMany({
      where: { postId: id },
      orderBy: { createdAt: "asc" },
      take: -pageSize - 1,
      cursor: cursor ? { id: cursor } : undefined,
      include: getCommentDataInclude(user.id),
    });

    const previousCursor = comments.length > pageSize ? comments[0]?.id : null;

    const data: CommentPage = {
      comments: comments.length > pageSize ? comments.slice(1) : comments,
      previousCursor,
    };

    return Response.json(data);
  } catch (err) {
    console.error(err);
    return new Response("Internal Server Error", { status: 500 });
  }
}
