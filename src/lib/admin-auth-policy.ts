/**
 * Admin access after Supabase sign-in: email must appear in `ADMIN_ALLOWED_EMAILS`
 * (comma-separated, case-insensitive). If the variable is unset or empty after
 * trimming, no emails are allowed.
 */
export function getAdminAllowedEmails(): string[] {
  const raw = process.env.ADMIN_ALLOWED_EMAILS?.trim();
  if (!raw) return [];
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isEmailAllowedAdmin(email: string | undefined): boolean {
  if (!email?.trim()) return false;
  const allowedEmails = getAdminAllowedEmails();
  return allowedEmails.includes(email.trim().toLowerCase());
}
