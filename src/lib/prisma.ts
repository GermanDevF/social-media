import { PrismaClient } from "@prisma/client";

// Añadimos el tipo globalmente para evitar el uso de 'unknown as'
declare global {
  // Esto solo se aplica en desarrollo; en producción no se usa 'global'
  var prisma: PrismaClient | undefined;
}

// Creamos la instancia (si no existe ya)
const prisma =
  global.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

// En desarrollo guardamos la instancia en 'global' para evitar múltiples conexiones
if (process.env.NODE_ENV !== "production") global.prisma = prisma;

export { prisma };
