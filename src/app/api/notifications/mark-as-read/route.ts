import { validateRequest } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH() {
  try {
    const session = await validateRequest();
    if (!session?.user) return new Response("Unauthorized", { status: 401 });

    await prisma.notification.updateMany({
      where: {
        recipientId: session.user.id,
        read: false,
      },
      data: {
        read: true,
      },
    });

    return new Response();
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
