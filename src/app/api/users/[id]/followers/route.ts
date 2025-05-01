import { validateRequest } from "@/auth";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { FollowerInfo } from "@/lib/types";
import { NotificationType } from "@prisma/client";

type Params = {
  params: { id: string };
};

function unauthorizedResponse() {
  return Response.json({ error: "Unauthorized" }, { status: 401 });
}

function errorResponse(message: string, status: number = 500) {
  return Response.json({ error: message }, { status });
}

async function getLoggedUser() {
  const { user } = await validateRequest();
  return user;
}

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    const loggedUser = await getLoggedUser();
    if (!loggedUser) return unauthorizedResponse();

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        followers: {
          where: { followerId: loggedUser.id },
          select: { followerId: true },
        },
        _count: { select: { followers: true } },
      },
    });

    if (!user) return errorResponse("User not found", 404);

    const data: FollowerInfo = {
      followers: user._count.followers,
      isFollowedByUser: !!user.followers.length,
    };

    return Response.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching followers:", error);
    return errorResponse("Error obteniendo los seguidores");
  }
}

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const loggedUser = await getLoggedUser();

    if (!loggedUser) return unauthorizedResponse();

    const data = {
      followerId: loggedUser.id,
      followingId: id,
    };

    await prisma.$transaction([
      prisma.follow.upsert({
        where: {
          followerId_followingId: {
            followerId: loggedUser.id,
            followingId: id,
          },
        },
        create: data,
        update: {},
      }),
      prisma.notification.create({
        data: {
          recipientId: id,
          issuerId: loggedUser.id,
          type: NotificationType.FOLLOW,
        },
      }),
    ]);

    return Response.json({ message: "Usuario seguido" }, { status: 200 });
  } catch (error) {
    console.error("Error following user:", error);
    return errorResponse("Error siguiendo al usuario");
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const loggedUser = await getLoggedUser();

    if (!loggedUser) return unauthorizedResponse();

    await prisma.$transaction([
      prisma.follow.deleteMany({
        where: {
          followerId: loggedUser.id,
          followingId: id,
        },
      }),
      prisma.notification.deleteMany({
        where: {
          recipientId: id,
          issuerId: loggedUser.id,
          type: NotificationType.FOLLOW,
        },
      }),
    ]);

    return Response.json(
      { message: "Usuario dejado de seguir" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error unfollowing user:", error);
    return errorResponse("Error dejando de seguir al usuario");
  }
}
