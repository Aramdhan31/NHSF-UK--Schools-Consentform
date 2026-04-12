import { PageHeader } from "@/components/PageHeader";
import { ButtonLink } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Admin dashboard"
        description="Manage NHSF (UK) Schools events and consent forms from one place."
        actions={
          <ButtonLink href="/admin/events/new" variant="primary">
            New event
          </ButtonLink>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <h2 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
              Edit · Duplicate · Submissions · Delete
            </h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Open the list to edit a programme, duplicate it, review submissions,
              or delete it.
            </p>
            <div className="mt-3">
              <ButtonLink href="/admin/events" variant="outline" size="sm">
                Open programme list
              </ButtonLink>
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
              Access
            </h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Admin sign-in uses a secure password hash and an encrypted session
              cookie. Keep your environment variables private.
            </p>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}

