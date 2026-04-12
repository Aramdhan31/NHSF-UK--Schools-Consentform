"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isEmailAllowedAdmin } from "@/lib/admin-auth-policy";
import { createClient } from "@/utils/supabase/server";

export type AdminLoginActionState = { error: string } | null;

function safeRedirectPath(next: unknown): string {
  if (typeof next !== "string") return "/admin";
  const n = next.trim();
  if (
    (n.startsWith("/admin") && !n.startsWith("/admin/login")) ||
    n.startsWith("/api/admin")
  ) {
    return n;
  }
  return "/admin";
}

function formCredential(formData: FormData, key: string): string {
  const v = formData.get(key);
  if (v == null) return "";
  return typeof v === "string" ? v : "";
}

/**
 * Supabase sign-in on the server; session cookies are written via the SSR client.
 * Credentials are never logged or returned (only a generic error message on failure).
 */
export async function loginAdmin(
  _prev: AdminLoginActionState,
  formData: FormData,
): Promise<AdminLoginActionState> {
  const email = formCredential(formData, "email").trim();
  const password = formCredential(formData, "password");

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  const supabase = createClient(await cookies());

  const { error: signError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signError) {
    return {
      error: "Invalid email or password. Please check and try again.",
    };
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user?.email || !isEmailAllowedAdmin(user.email)) {
    await supabase.auth.signOut();
    return {
      error: "This account is not authorised for admin access.",
    };
  }

  revalidatePath("/", "layout");
  redirect(safeRedirectPath(formData.get("next")));
}
