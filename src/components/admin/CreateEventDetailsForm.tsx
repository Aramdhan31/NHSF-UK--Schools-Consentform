"use client";

import { createEventAction } from "@/app/admin/events/actions";
import {
  consentStarterLabel,
  type ConsentStarterValue,
  CONSENT_STARTER_SAVED,
} from "@/components/admin/ConsentFormStarterGrid";
import { FormTemplateEditor } from "@/components/admin/FormTemplateEditor";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import type { FormFieldDef } from "@/lib/form-template";

type StarterChoice = Exclude<ConsentStarterValue, typeof CONSENT_STARTER_SAVED>;

export function CreateEventDetailsForm({
  consentFields,
  editorKey,
  starterChoice,
  onBack,
}: {
  consentFields: FormFieldDef[];
  editorKey: number;
  starterChoice: StarterChoice;
  onBack: () => void;
}) {
  return (
    <Card className="relative z-10">
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
            Event details
          </h2>
          <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
            Consent form:{" "}
            <span className="font-medium text-zinc-800 dark:text-zinc-200">
              {consentStarterLabel(starterChoice)}
            </span>
            .{" "}
            <button
              type="button"
              className="touch-manipulation font-medium text-zinc-900 underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:text-zinc-100 dark:decoration-zinc-600 dark:hover:decoration-zinc-400"
              onClick={onBack}
            >
              Change starting point
            </button>
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <form action={createEventAction} className="flex flex-col gap-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                Title *
              </span>
              <Input
                name="title"
                required
                placeholder="e.g. Summer Camp 2026"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                Slug (URL)
              </span>
              <Input
                name="slug"
                placeholder="summer-camp-2026"
                pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                title="Lowercase letters, numbers, and hyphens only"
              />
            </label>
          </div>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
              Description
            </span>
            <Textarea
              name="description"
              rows={3}
              placeholder="What parents should know about this event."
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                Event date
              </span>
              <Input name="eventDate" type="datetime-local" />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                Opens at
              </span>
              <Input name="opensAt" type="datetime-local" />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                Closes at
              </span>
              <Input name="closesAt" type="datetime-local" />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                Status
              </span>
              <select
                name="status"
                defaultValue="published"
                className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
              >
                <option value="published">published (listed on the site)</option>
                <option value="draft">draft (admin only)</option>
              </select>
            </label>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-900/30 sm:p-5">
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              Consent form fields
            </p>
            <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
              Edit labels, order, and optional questions. The hidden JSON is
              submitted with this form.
            </p>
            <div className="mt-4">
              <FormTemplateEditor
                key={editorKey}
                initialFields={consentFields}
              />
            </div>
          </div>

          <div className="flex justify-end border-t border-zinc-100 pt-4 dark:border-zinc-800">
            <Button type="submit" variant="primary">
              Create event
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
