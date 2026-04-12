import { PageHeader } from "@/components/PageHeader";
import { CreateEventPageClient } from "@/components/admin/CreateEventPageClient";

export default async function AdminNewEventPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const sp = await searchParams;

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <PageHeader
        title="Create event"
        description="Step 1: choose how the consent form should start. Step 2: event details and fine-tune every question before you publish."
      />

      <CreateEventPageClient
        badFormTemplateError={sp.error === "bad-form-template"}
      />
    </div>
  );
}
