import { Suspense } from "react";
import { PageHeader } from "@/components/PageHeader";
import { AdminLoginAlerts } from "@/components/admin/AdminLoginAlerts";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";

export default function AdminLoginPage() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6">
      <PageHeader
        title="Staff sign in"
        description="For authorised NHSF (UK) Schools team members only. Use the email and password you were given to manage events, consent forms, and submissions."
      />

      <Card>
        <CardHeader>
          <h2 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
            Sign in
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            Sign-in details are personal—do not share your password. Access is
            limited to approved staff; if you need an account or have trouble
            signing in, contact your NHSF Schools lead.
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
