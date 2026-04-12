"use client";

import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";

export function AdminChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const onLogin = pathname === "/admin/login";

  return (
    <div>
      {!onLogin ? (
        <div className="mb-6 flex justify-end border-b border-zinc-200 pb-4 dark:border-zinc-800">
          <form action="/api/auth/logout" method="POST">
            <Button type="submit" variant="outline" size="sm">
              Sign out
            </Button>
          </form>
        </div>
      ) : null}
      {children}
    </div>
  );
}
