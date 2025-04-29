import { prisma } from "@/lib/prisma";
import { UTApi } from "uploadthing/server";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Obtener los uploads que no están asociados a un post y que tienen más de 30 días
    const unusedUploads = await prisma.media.findMany({
      where: {
        post: null,
        ...(process.env.NODE_ENV === "production"
          ? {
              createdAt: {
                lte: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
              },
            }
          : {}),
      },
      select: {
        id: true,
        url: true,
      },
    });

    console.log(
      unusedUploads.map(
        (upload) =>
          upload.url.split(`/a/${process.env.UPLOADTHING_APP_ID}/`)[1],
      ),
    );

    // Eliminar los uploads de UploadThing
    new UTApi().deleteFiles(
      unusedUploads.map(
        (upload) =>
          upload.url.split(`/a/${process.env.UPLOADTHING_APP_ID}/`)[1],
      ),
    );

    // Eliminar los uploads de la base de datos
    await prisma.media.deleteMany({
      where: {
        id: { in: unusedUploads.map((upload) => upload.id) },
      },
    });

    return Response.json({ message: "Uploads deleted" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
