"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { FormFieldDef } from "@/lib/form-template";
import {
  ConsentFormStarterGrid,
  consentStarterLabel,
  CONSENT_STARTER_SAVED,
  type ConsentStarterValue,
} from "@/components/admin/ConsentFormStarterGrid";
import { FormTemplateEditor } from "@/components/admin/FormTemplateEditor";
import { getConsentFormPreset } from "@/lib/consent-form-presets";

/** Edit event: starter choices + field editor inside the save form. */
export function EventConsentTemplateSection({
  initialFields,
}: {
  initialFields: FormFieldDef[];
}) {
  const [editorKey, setEditorKey] = useState(0);
  const [selectedStarter, setSelectedStarter] =
    useState<ConsentStarterValue>(CONSENT_STARTER_SAVED);
  const [currentInitial, setCurrentInitial] =
    useState<FormFieldDef[]>(initialFields);

  const serverSig = useMemo(() => JSON.stringify(initialFields), [initialFields]);
  const lastServerSig = useRef(serverSig);

  useEffect(() => {
    if (serverSig === lastServerSig.current) return;
    lastServerSig.current = serverSig;
    setCurrentInitial(initialFields);
    setSelectedStarter(CONSENT_STARTER_SAVED);
    setEditorKey((k) => k + 1);
  }, [serverSig, initialFields]);

  const applyStarter = useCallback(
    (key: ConsentStarterValue) => {
      setSelectedStarter(key);
      if (key === CONSENT_STARTER_SAVED) {
        setCurrentInitial(initialFields);
      } else {
        setCurrentInitial(getConsentFormPreset(key));
      }
      setEditorKey((k) => k + 1);
    },
    [initialFields],
  );

  return (
    <div className="space-y-4 rounded-xl border border-zinc-200 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-900/30 sm:p-5">
      <div>
        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
          Consent form template
        </p>
        <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
          Pick a starting point, then edit fields below. Choosing another option
          replaces the field list.
        </p>
      </div>

      <ConsentFormStarterGrid
        variant="edit"
        groupId="edit-event-consent"
        selected={selectedStarter}
        onSelect={applyStarter}
      />

      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        Selected:{" "}
        <span className="font-medium text-zinc-700 dark:text-zinc-300">
          {consentStarterLabel(selectedStarter)}
        </span>
      </p>

      <FormTemplateEditor key={editorKey} initialFields={currentInitial} />
    </div>
  );
}
