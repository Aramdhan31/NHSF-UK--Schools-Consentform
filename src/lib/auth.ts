import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { isEmailAllowedAdmin } from "@/lib/admin-auth-policy";
import { createClient } from "@/utils/supabase/server";

export type AdminUser = User;

/**
 * Server-only: Supabase user if signed in **and** their email is in
 * `ADMIN_ALLOWED_EMAILS` (same rule as `isEmailAllowedAdmin` / middleware).
 *
 * Returns `null` when missing or not allowlisted so Route Handlers (e.g. CSV export)
 * can respond with 401 instead of redirecting. For pages and Server Actions, use
 * `requireAdminUser()` which redirects to `/admin/login` — equivalent to the
 * “not signed in / not on list → redirect” flow in your Step 2 checklist.
 */
export async function getAdminUser(): Promise<AdminUser | null> {
  const supabase = createClient(await cookies());
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  if (!isEmailAllowedAdmin(user.email)) {
    return null;
  }

  return user;
}

export async function isAdminAuthenticated(): Promise<boolean> {
  return (await getAdminUser()) !== null;
}

/** Redirects to `/admin/login` if not signed in or not on `ADMIN_ALLOWED_EMAILS`. */
export async function requireAdminUser(): Promise<AdminUser> {
  const user = await getAdminUser();
  if (!user) {
    redirect("/admin/login");
  }
  return user;
}
