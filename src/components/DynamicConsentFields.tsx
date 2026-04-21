"use client";

import { useMemo, useState } from "react";
import type { FormFieldDef } from "@/lib/form-template";
import { PARTICIPANT_SCHOOL_OTHER_VALUE } from "@/lib/participant-schools";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

function groupFormFields(fields: FormFieldDef[]) {
  const map = new Map<string, FormFieldDef[]>();
  for (const f of fields) {
    const key = f.group ?? "_default";
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(f);
  }
  return [...map.entries()].map(([key, list]) => ({
    key,
    title:
      list.find((x) => x.groupTitle)?.groupTitle ??
      (key === "_default" ? "Details" : key),
    fields: list,
  }));
}

function FieldInput({
  field,
  selectValue,
  onSelectChange,
}: {
  field: FormFieldDef;
  /** When set, the select is controlled (used for school → show/hide Other). */
  selectValue?: string;
  onSelectChange?: (value: string) => void;
}) {
  const required = field.required;
  const labelSuffix = required ? " *" : "";

  if (field.type === "checkbox") {
    return (
      <label className="flex min-h-12 cursor-pointer touch-manipulation gap-3 rounded-xl border border-zinc-200 bg-zinc-50/80 p-4 dark:border-zinc-800 dark:bg-zinc-900/40">
        <input
          type="checkbox"
          name={field.id}
          required={required}
          className="mt-0.5 h-5 w-5 shrink-0 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 dark:border-zinc-600 dark:bg-zinc-950 dark:focus:ring-zinc-100"
        />
        <span className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
          {field.label}
          {labelSuffix}
        </span>
      </label>
    );
  }

  if (field.type === "select") {
    const opts = field.options ?? [];
    const controlled = selectValue !== undefined && onSelectChange !== undefined;
    return (
      <label className="block space-y-1.5">
        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {field.label}
          {labelSuffix}
        </span>
        <select
          name={field.id}
          required={required}
          {...(controlled
            ? {
                value: selectValue,
                onChange: (e) => onSelectChange!(e.target.value),
              }
            : { defaultValue: "" })}
          className="h-11 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 shadow-sm transition-[border-color,box-shadow] focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400/30 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-zinc-500 dark:focus:ring-zinc-500/25"
        >
          {required ? (
            <option value="" disabled>
              Select…
            </option>
          ) : (
            <option value="">—</option>
          )}
          {opts.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>
    );
  }

  if (field.type === "textarea") {
    return (
      <label className="block space-y-1.5">
        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {field.label}
          {labelSuffix}
        </span>
        <Textarea
          name={field.id}
          rows={field.rows ?? 4}
          className="min-h-[100px]"
          required={required}
          placeholder={field.placeholder ?? ""}
        />
      </label>
    );
  }

  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
        {field.label}
        {labelSuffix}
      </span>
      <Input
        name={field.id}
        type={field.type}
        required={required}
        placeholder={field.placeholder}
        autoComplete={field.autoComplete}
      />
    </label>
  );
}

export function DynamicConsentFields({ fields }: { fields: FormFieldDef[] }) {
  const hasSchoolSelect = useMemo(
    () => fields.some((f) => f.id === "school" && f.type === "select"),
    [fields],
  );
  const [schoolChoice, setSchoolChoice] = useState("");
  const groups = groupFormFields(fields);

  return (
    <>
      {groups.map((g) => {
        const visibleFields = g.fields.filter((field) => {
          if (
            field.id === "schoolOther" &&
            hasSchoolSelect &&
            schoolChoice !== PARTICIPANT_SCHOOL_OTHER_VALUE
          ) {
            return false;
          }
          return true;
        });
        return (
          <fieldset key={g.key} className="space-y-4">
            <legend className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {g.title}
            </legend>
            <div className="grid gap-4 sm:grid-cols-2">
              {visibleFields.map((field) => (
                <div
                  key={field.id}
                  className={
                    field.type === "checkbox" ||
                    field.type === "textarea" ||
                    field.type === "select"
                      ? "sm:col-span-2"
                      : ""
                  }
                >
                  <FieldInput
                    field={field}
                    {...(field.id === "school" && field.type === "select"
                      ? {
                          selectValue: schoolChoice,
                          onSelectChange: setSchoolChoice,
                        }
                      : {})}
                  />
                </div>
              ))}
            </div>
          </fieldset>
        );
      })}
    </>
  );
}
