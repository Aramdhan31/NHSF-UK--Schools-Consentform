import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  /**
   * Runtime queries only: Supabase **Supavisor session pooler** on port 5432 (`DATABASE_URL`).
   * Do not use `DIRECT_URL` here — that URL is for Prisma Migrate / CLI (`prisma.config.ts`).
   */
  const connectionString =
    process.env.DATABASE_URL ??
    "postgresql://localhost:5432/nhsf_placeholder_build";

  const adapter = new PrismaPg(connectionString);
  return new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export const prisma =
  globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
