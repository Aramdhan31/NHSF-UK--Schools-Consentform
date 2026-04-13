"use client";

import { useCallback, useMemo, useState } from "react";
import type { FormFieldDef } from "@/lib/form-template";
import { formFieldTypes } from "@/lib/form-template";
import {
  adminLinesToSchoolOptions,
  defaultParticipantSchoolOptions,
  schoolOptionsToAdminLines,
} from "@/lib/participant-schools";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/cn";

function newFieldId() {
  return `field_${Math.random().toString(36).slice(2, 10)}`;
}

export function FormTemplateEditor({
  initialFields,
  className,
}: {
  initialFields: FormFieldDef[];
  className?: string;
}) {
  const [fields, setFields] = useState<FormFieldDef[]>(() => [...initialFields]);

  const json = useMemo(() => JSON.stringify(fields), [fields]);

  /**
   * Server Actions read FormData from the DOM. A controlled hidden `value` can lag
   * behind the latest React state in edge cases; remounting an uncontrolled field
   * with `key={json}` guarantees the submitted payload matches the editor.
   */
  const hiddenFieldsProps = {
    type: "hidden" as const,
    name: "formFieldsJson",
    defaultValue: json,
  };

  const addField = useCallback(() => {
    setFields((prev) => [
      ...prev,
      {
        id: newFieldId(),
        label: "New question",
        type: "text",
        required: false,
        placeholder: "",
      },
    ]);
  }, []);

  const removeAt = useCallback((index: number) => {
    setFields((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const move = useCallback((index: number, dir: -1 | 1) => {
    setFields((prev) => {
      const next = [...prev];
      const j = index + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[index], next[j]] = [next[j], next[index]];
      return next;
    });
  }, []);

  const patch = useCallback((index: number, patch: Partial<FormFieldDef>) => {
    setFields((prev) =>
      prev.map((f, i) => (i === index ? { ...f, ...patch } : f)),
    );
  }, []);

  return (
    <div className={cn("space-y-4", className)}>
      <input key={json} {...hiddenFieldsProps} />

      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
          Consent form fields
        </p>
        <Button type="button" variant="secondary" size="sm" onClick={addField}>
          Add field
        </Button>
      </div>

      <ul className="space-y-3">
        {fields.map((field, index) => (
          <li
            key={field.id}
            className="rounded-xl border border-zinc-200 bg-zinc-50/80 p-4 dark:border-zinc-800 dark:bg-zinc-900/40"
          >
            <div className="flex flex-wrap items-center gap-2 border-b border-zinc-200 pb-3 dark:border-zinc-700">
              <span className="text-xs font-mono text-zinc-500">{field.id}</span>
              <div className="ml-auto flex flex-wrap gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                >
                  Up
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => move(index, 1)}
                  disabled={index === fields.length - 1}
                >
                  Down
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700 dark:text-red-400"
                  onClick={() => removeAt(index)}
                  disabled={fields.length <= 1}
                >
                  Remove
                </Button>
              </div>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <label className="block space-y-1 sm:col-span-2">
                <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  Label (shown to parents)
                </span>
                <Input
                  value={field.label}
                  onChange={(e) => patch(index, { label: e.target.value })}
                />
              </label>
              <label className="block space-y-1">
                <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  Type
                </span>
                <select
                  className="h-10 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm dark:border-zinc-800 dark:bg-zinc-950"
                  value={field.type}
                  onChange={(e) => {
                    const t = e.target.value as FormFieldDef["type"];
                    if (t === "select") {
                      const opts =
                        field.id === "school"
                          ? defaultParticipantSchoolOptions()
                          : field.options?.length
                            ? field.options
                            : [
                                { value: "option_a", label: "Option A" },
                                { value: "option_b", label: "Option B" },
                              ];
                      patch(index, { type: "select", options: opts });
                    } else {
                      patch(index, { type: t, options: undefined });
                    }
                  }}
                >
                  {formFieldTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex items-center gap-2 pt-6 sm:pt-8">
                <input
                  type="checkbox"
                  checked={field.required}
                  onChange={(e) =>
                    patch(index, { required: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-zinc-300"
                />
                <span className="text-sm text-zinc-700 dark:text-zinc-300">
                  Required
                </span>
              </label>
              <label className="block space-y-1 sm:col-span-2">
                <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  Placeholder (optional)
                </span>
                <Input
                  value={field.placeholder ?? ""}
                  onChange={(e) =>
                    patch(index, {
                      placeholder: e.target.value || undefined,
                    })
                  }
                />
              </label>
              <label className="block space-y-1">
                <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  Section key (optional)
                </span>
                <Input
                  value={field.group ?? ""}
                  placeholder="e.g. parent"
                  onChange={(e) =>
                    patch(index, {
                      group: e.target.value || undefined,
                    })
                  }
                />
              </label>
              <label className="block space-y-1">
                <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  Section title (optional)
                </span>
                <Input
                  value={field.groupTitle ?? ""}
                  placeholder="e.g. Parent or carer"
                  onChange={(e) =>
                    patch(index, {
                      groupTitle: e.target.value || undefined,
                    })
                  }
                />
              </label>
              {field.type === "select" ? (
                <div className="space-y-2 sm:col-span-2">
                  {field.id === "school" ? (
                    <>
                      <label className="block space-y-1">
                        <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                          School names (one per line)
                        </span>
                        <textarea
                          spellCheck={false}
                          autoCorrect="off"
                          rows={10}
                          className="w-full rounded-xl border border-zinc-200 bg-white p-3 text-sm text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
                          value={schoolOptionsToAdminLines(field.options)}
                          onChange={(e) =>
                            patch(index, {
                              options: adminLinesToSchoolOptions(
                                e.target.value,
                              ),
                            })
                          }
                        />
                      </label>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        Parents always see an{" "}
                        <span className="font-medium text-zinc-700 dark:text-zinc-300">
                          Other
                        </span>{" "}
                        choice at the end; if they pick it, they type their
                        school in the next field on the form.
                      </p>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-zinc-700 dark:text-zinc-300"
                        onClick={() =>
                          patch(index, {
                            options: defaultParticipantSchoolOptions(),
                          })
                        }
                      >
                        Reset to standard school list
                      </Button>
                    </>
                  ) : (
                    <label className="block space-y-1">
                      <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                        Options (one per line:{" "}
                        <code className="text-[11px]">value|label</code>)
                      </span>
                      <textarea
                        spellCheck={false}
                        autoCorrect="off"
                        rows={6}
                        className="w-full rounded-xl border border-zinc-200 bg-white p-3 font-mono text-xs text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
                        value={
                          field.options
                            ?.map((o) => `${o.value}|${o.label}`)
                            .join("\n") ?? ""
                        }
                        onChange={(e) => {
                          const options = e.target.value
                            .split("\n")
                            .map((line) => {
                              const pipe = line.indexOf("|");
                              if (pipe === -1) {
                                const v = line.trim();
                                return v ? { value: v, label: v } : null;
                              }
                              const value = line.slice(0, pipe).trim();
                              const label =
                                line.slice(pipe + 1).trim() || value;
                              return value ? { value, label } : null;
                            })
                            .filter(
                              (o): o is { value: string; label: string } =>
                                o !== null,
                            );
                          patch(index, { options });
                        }}
                      />
                    </label>
                  )}
                </div>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
