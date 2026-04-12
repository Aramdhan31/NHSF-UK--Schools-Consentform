import { Suspense } from "react";
import { PageHeader } from "@/components/PageHeader";
import { AdminLoginAlerts } from "@/components/admin/AdminLoginAlerts";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";

export default function AdminLoginPage() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6">
      <PageHeader
        title="Admin sign in"
        description="NHSF (UK) Schools — staff sign in with your NHSF email. Accounts are created in Supabase (invite only; keep public sign-up disabled)."
      />

      <Card>
        <CardHeader>
          <h2 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
            Sign in
          </h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Each person uses their own email and password. Only emails listed in{" "}
            <code className="font-mono text-xs">ADMIN_ALLOWED_EMAILS</code> on the
            server can access admin.
          </p>
        </CardHeader>
        <CardContent>
          <Suspense fallback={null}>
            <AdminLoginAlerts />
          </Suspense>
          <Suspense fallback={<p className="text-sm text-zinc-500">Loading…</p>}>
            <AdminLoginForm />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
