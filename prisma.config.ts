import { config as loadEnv } from "dotenv";
import { defineConfig } from "prisma/config";

// Match Next.js: base `.env`, then `.env.local` overrides (e.g. Supabase URLs).
loadEnv({ path: ".env" });
loadEnv({ path: ".env.local", override: true });

/**
 * Supabase + Prisma (recommended split):
 *
 * - `DATABASE_URL` — Supavisor **session** pooler (port 5432). Use for the app runtime only
 *   (`src/lib/db.ts` + `PrismaPg` adapter).
 * - `DIRECT_URL` — Direct Postgres (`db.<project-ref>.supabase.co:5432`). Use for Prisma CLI
 *   commands that need a real server connection (migrate, introspect, studio).
 *
 * Prisma ORM v7: there is no `directUrl` in `prisma.config.ts`; this `datasource.url` is what
 * the CLI uses. Prefer `DIRECT_URL` so migrations avoid pooler limitations; local Postgres
 * can omit `DIRECT_URL` and fall back to `DATABASE_URL`.
 */
const datasourceUrlForCli =
  process.env.DIRECT_URL?.trim() ||
  process.env.DATABASE_URL?.trim() ||
  "";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: datasourceUrlForCli,
  },
});
