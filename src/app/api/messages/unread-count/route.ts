import { validateRequest } from "@/auth";
import streamServerClient from "@/lib/stream";
import { MessageCount } from "@/lib/types";

export async function GET() {
  try {
    const session = await validateRequest();
    if (!session?.user) return new Response("Unauthorized", { status: 401 });

    const { total_unread_count } = await streamServerClient.getUnreadCount(
      session.user.id,
    );

    const data: MessageCount = {
      total_unread_count,
    };

    return Response.json(data);
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
