import { validateRequest } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NotificationCount } from "@/lib/types";
export async function GET() {
  try {
    const session = await validateRequest();
    if (!session?.user) return new Response("Unauthorized", { status: 401 });

    const unreadCount = await prisma.notification.count({
      where: {
        recipientId: session.user.id,
        read: false,
      },
    });

    const data: NotificationCount = {
      unreadCount,
    };

    return Response.json(data);
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
