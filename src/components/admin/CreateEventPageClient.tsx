"use client";

import dynamic from "next/dynamic";
import { useCallback, useState } from "react";
import {
  ConsentFormStarterGrid,
  consentStarterLabel,
  type ConsentStarterValue,
  CONSENT_STARTER_SAVED,
} from "@/components/admin/ConsentFormStarterGrid";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import type { FormFieldDef } from "@/lib/form-template";
import { getConsentFormPreset } from "@/lib/consent-form-presets";

const CreateEventDetailsForm = dynamic(
  () =>
    import("@/components/admin/CreateEventDetailsForm").then(
      (m) => m.CreateEventDetailsForm,
    ),
  {
    ssr: false,
    loading: () => (
      <p className="rounded-xl border border-zinc-200 bg-white px-4 py-6 text-center text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
        Loading event form…
      </p>
    ),
  },
);

type Step = 1 | 2;

export function CreateEventPageClient({
  badFormTemplateError,
}: {
  badFormTemplateError: boolean;
}) {
  const [step, setStep] = useState<Step>(1);
  const [starterChoice, setStarterChoice] =
    useState<Exclude<ConsentStarterValue, typeof CONSENT_STARTER_SAVED>>(
      "default",
    );
  const [consentFields, setConsentFields] = useState<FormFieldDef[]>(() =>
    getConsentFormPreset("default"),
  );
  const [editorKey, setEditorKey] = useState(0);

  const applyStarterChoice = useCallback((key: ConsentStarterValue) => {
    if (key === CONSENT_STARTER_SAVED) return;
    setStarterChoice(key);
    setConsentFields(getConsentFormPreset(key));
    setEditorKey((k) => k + 1);
  }, []);

  const goContinue = useCallback(() => {
    setConsentFields(getConsentFormPreset(starterChoice));
    setEditorKey((k) => k + 1);
    setStep(2);
  }, [starterChoice]);

  const goBack = useCallback(() => {
    setStep(1);
  }, []);

  return (
    <>
      {badFormTemplateError ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900 dark:border-red-900 dark:bg-red-950/40 dark:text-red-100">
          Consent form is missing a required core field or has the wrong field
          type. Keep the standard ids (parentName, declaration, etc.) — pick a
          starting point again and try once more.
        </p>
      ) : null}

      {step === 1 ? (
        <Card className="relative z-10">
          <CardHeader>
            <h2 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
              Consent form — choose a starting point
            </h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              First, decide whether to use the standard base form or a programme
              template. On the next step you’ll enter event details and can edit
              every field.
            </p>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <ConsentFormStarterGrid
              variant="create"
              groupId="create-event-consent"
              selected={starterChoice}
              onSelect={applyStarterChoice}
            />
            <div className="flex flex-wrap items-center justify-end gap-3 border-t border-zinc-100 pt-4 dark:border-zinc-800">
              <p className="mr-auto text-xs text-zinc-500 dark:text-zinc-400">
                Selected:{" "}
                <span className="font-medium text-zinc-700 dark:text-zinc-300">
                  {consentStarterLabel(starterChoice)}
                </span>
              </p>
              <button
                type="button"
                onClick={goContinue}
                className="inline-flex h-10 touch-manipulation items-center justify-center gap-2 rounded-xl bg-zinc-900 px-4 text-sm font-semibold text-white shadow-md transition-[color,background-color,box-shadow] hover:bg-zinc-800 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200 dark:focus-visible:ring-zinc-100 dark:focus-visible:ring-offset-zinc-950"
              >
                Continue to event details
              </button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <CreateEventDetailsForm
          consentFields={consentFields}
          editorKey={editorKey}
          starterChoice={starterChoice}
          onBack={goBack}
        />
      )}
    </>
  );
}
