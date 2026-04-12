import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { getSiteUrl } from "@/lib/site-url";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: base,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${base}/events`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${base}/privacy`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];

  try {
    const rows = await prisma.event.findMany({
      where: { status: "published" },
      select: { slug: true, createdAt: true },
    });
    const eventEntries: MetadataRoute.Sitemap = rows.map((row) => ({
      url: `${base}/events/${row.slug}`,
      lastModified: row.createdAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
    return [...staticEntries, ...eventEntries];
  } catch {
    return staticEntries;
  }
}
