"use client";

import {
  CONSENT_FORM_PRESET_LABELS,
  CONSENT_FORM_PROGRAM_PRESET_KEYS,
  CONSENT_FORM_PRESET_USE_TITLE,
  type ConsentFormPresetKey,
  type ConsentProgramPresetKey,
} from "@/lib/consent-form-presets";
import { cn } from "@/lib/cn";

/** Edit mode: keep saved fields. Create flow: not used. */
export const CONSENT_STARTER_SAVED = "__saved__" as const;

export type ConsentStarterValue =
  | typeof CONSENT_STARTER_SAVED
  | ConsentFormPresetKey;

export function consentStarterLabel(key: ConsentStarterValue): string {
  if (key === CONSENT_STARTER_SAVED) return "Current saved form";
  if (key === "default") return "From scratch";
  return `Use ${CONSENT_FORM_PRESET_USE_TITLE[key]} template`;
}

export function ConsentFormStarterGrid({
  variant,
  groupId,
  selected,
  onSelect,
}: {
  variant: "create" | "edit";
  /** Stable prefix for a11y ids (unique per page). */
  groupId: string;
  selected: ConsentStarterValue;
  onSelect: (key: ConsentStarterValue) => void;
}) {
  const legendId = `${groupId}-legend`;

  return (
    <fieldset className="min-w-0 border-0 p-0">
      <legend id={legendId} className="mb-2 text-xs font-medium text-zinc-600 dark:text-zinc-400">
        Choose a starting point
      </legend>
      <div
        className="grid gap-2 sm:grid-cols-2"
        role="radiogroup"
        aria-labelledby={legendId}
      >
        {variant === "edit" ? (
          <StarterOption
            optionId={`${groupId}-saved`}
            selected={selected === CONSENT_STARTER_SAVED}
            title="Keep current saved form"
            description="Continue with the fields already stored for this event."
            onPick={() => onSelect(CONSENT_STARTER_SAVED)}
          />
        ) : null}

        <StarterOption
          optionId={`${groupId}-scratch`}
          selected={selected === "default"}
          title="From scratch"
          description="Standard NHSF Schools consent layout (parent, child, medical, declaration). Not empty — it’s the usual base form you can rename and extend."
          onPick={() => onSelect("default")}
        />

        {CONSENT_FORM_PROGRAM_PRESET_KEYS.map((key: ConsentProgramPresetKey) => (
          <StarterOption
            key={key}
            optionId={`${groupId}-${key}`}
            selected={selected === key}
            title={`Use ${CONSENT_FORM_PRESET_USE_TITLE[key]} template`}
            description={`${CONSENT_FORM_PRESET_LABELS[key]} — programme wording and structure.`}
            onPick={() => onSelect(key)}
          />
        ))}
      </div>
    </fieldset>
  );
}

function StarterOption({
  optionId,
  selected,
  title,
  description,
  onPick,
}: {
  optionId: string;
  selected: boolean;
  title: string;
  description: string;
  onPick: () => void;
}) {
  return (
    <button
      type="button"
      id={optionId}
      role="radio"
      aria-checked={selected}
      onClick={onPick}
      className={cn(
        "flex w-full min-w-0 gap-3 rounded-xl border p-3 text-left transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 dark:focus-visible:ring-zinc-100 dark:focus-visible:ring-offset-zinc-950",
        selected
          ? "border-zinc-900 bg-white ring-2 ring-zinc-900/10 dark:border-zinc-100 dark:bg-zinc-950 dark:ring-zinc-100/10"
          : "border-zinc-200 bg-white/80 hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-950/60 dark:hover:border-zinc-600",
      )}
    >
      <span
        className={cn(
          "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2",
          selected
            ? "border-zinc-900 bg-zinc-900 dark:border-zinc-100 dark:bg-zinc-100"
            : "border-zinc-300 bg-white dark:border-zinc-600 dark:bg-zinc-900",
        )}
        aria-hidden
      >
        {selected ? (
          <span className="block h-1.5 w-1.5 rounded-full bg-white dark:bg-zinc-900" />
        ) : null}
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          {title}
        </span>
        <span className="mt-0.5 block text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
          {description}
        </span>
      </span>
    </button>
  );
}
