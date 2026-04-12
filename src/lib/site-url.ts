/**
 * Canonical origin for Open Graph, sitemap, robots, and JSON-LD.
 * Set `NEXT_PUBLIC_SITE_URL` in production (e.g. https://schools.example.org).
 * On Vercel, `VERCEL_URL` is used when the public URL is not set.
 */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) {
    return explicit.replace(/\/$/, "");
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`;
  }
  return "https://nhsf-schools-portal.vercel.app";
}

export function getMetadataBaseUrl(): URL {
  return new URL(`${getSiteUrl()}/`);
}
