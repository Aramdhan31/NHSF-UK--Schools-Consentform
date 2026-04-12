"use client";

import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { loginAdmin } from "@/app/admin/login/actions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="mt-2" disabled={pending}>
      {pending ? "Signing in…" : "Sign in"}
    </Button>
  );
}

export function AdminLoginForm() {
  const searchParams = useSearchParams();
  const nextParam = searchParams.get("next");
  const nextHidden =
    nextParam &&
    ((nextParam.startsWith("/admin") && !nextParam.startsWith("/admin/login")) ||
      nextParam.startsWith("/api/admin"))
      ? nextParam
      : "";

  const [state, formAction] = useActionState(loginAdmin, null);

  return (
    <form className="flex flex-col gap-3" action={formAction}>
      {nextHidden ? <input type="hidden" name="next" value={nextHidden} /> : null}
      {state?.error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
          {state.error}
        </p>
      ) : null}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
          NHSF email
        </label>
        <Input
          name="email"
          type="email"
          autoComplete="email"
          required
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
          Password
        </label>
        <Input
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </div>
      <SubmitButton />
    </form>
  );
}
