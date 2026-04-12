"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/utils/supabase/client";

/** Shown when middleware redirects with ?error=forbidden (signed in but not allowed). */
export function AdminLoginAlerts() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const forbidden = searchParams.get("error") === "forbidden";
  const [pending, setPending] = useState(false);

  if (!forbidden) return null;

  async function signOut() {
    setPending(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.replace("/admin/login");
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-3 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
      <p className="font-medium">This account is not authorised for admin access.</p>
      <p className="mt-1 text-amber-800 dark:text-amber-200">
        You are signed in, but this email is not authorised for the staff area.
        Contact your NHSF Schools administrator if you need access, or sign out
        and try another account.
      </p>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="mt-3"
        disabled={pending}
        onClick={() => void signOut()}
      >
        {pending ? "Signing out…" : "Sign out"}
      </Button>
    </div>
  );
}
