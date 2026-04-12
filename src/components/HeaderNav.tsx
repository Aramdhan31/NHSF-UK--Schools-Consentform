"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/cn";

const desktopLinks = [
  { href: "/events", label: "Events" },
  { href: "/admin", label: "Admin" },
] as const;

const mobileLinks = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Events" },
  { href: "/admin", label: "Admin" },
  { href: "/privacy", label: "Privacy" },
] as const;

const desktopLinkClass =
  "inline-flex min-h-11 items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium text-zinc-200 touch-manipulation transition-colors hover:bg-white/10 hover:text-white active:bg-white/15";

/** Below sticky header (mobile bar + safe area; keep in sync with SiteHeader height) */
const mobileNavTop = "top-[calc(env(safe-area-inset-top,0px)+4.25rem)]";

export function HeaderNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  /* Lock scroll on body only — html overflow:hidden breaks fixed overlays on some mobile WebKit builds */
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <nav
        className="hidden items-center gap-1 md:flex"
        aria-label="Primary"
      >
        {desktopLinks.map(({ href, label }) => (
          <Link key={href} href={href} className={desktopLinkClass}>
            {label}
          </Link>
        ))}
      </nav>

      <button
        type="button"
        className={cn(
          "relative z-[1100] flex h-12 w-12 shrink-0 cursor-pointer touch-manipulation items-center justify-center rounded-xl text-zinc-100 transition-colors md:hidden",
          "hover:bg-white/10 active:bg-white/15",
          "pointer-events-auto",
          "me-2",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/80 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950",
        )}
        aria-expanded={open}
        aria-controls="mobile-nav-drawer"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
      >
        {open ? (
          <X className="h-6 w-6" strokeWidth={2} aria-hidden />
        ) : (
          <Menu className="h-6 w-6" strokeWidth={2} aria-hidden />
        )}
      </button>

      {open && typeof window !== "undefined"
        ? createPortal(
            <div className="pointer-events-auto md:hidden">
              <button
                type="button"
                className={cn(
                  "fixed inset-x-0 bottom-0 z-[1040] bg-zinc-950/75 backdrop-blur-[2px]",
                  mobileNavTop,
                )}
                aria-label="Close menu"
                onClick={() => setOpen(false)}
              />
              <div
                id="mobile-nav-drawer"
                role="dialog"
                aria-modal="true"
                aria-label="Site menu"
                className={cn(
                  "fixed bottom-0 right-0 z-[1050] flex w-[min(100%,20rem)] flex-col border-l border-t border-white/10 bg-zinc-950 shadow-2xl",
                  mobileNavTop,
                  "rounded-tl-2xl",
                  "pt-4",
                  "pb-[max(1rem,env(safe-area-inset-bottom,0px))]",
                  "pl-5 pr-[max(1.25rem,env(safe-area-inset-right,0px))]",
                )}
              >
                <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
                  <span className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">
                    Menu
                  </span>
                  <button
                    type="button"
                    className="flex h-10 w-10 touch-manipulation items-center justify-center rounded-lg text-zinc-300 hover:bg-white/10 hover:text-white"
                    aria-label="Close menu"
                    onClick={() => setOpen(false)}
                  >
                    <X className="h-5 w-5" strokeWidth={2} />
                  </button>
                </div>
                <ul className="mt-6 flex flex-col gap-1">
                  {mobileLinks.map(({ href, label }) => {
                    const active =
                      href === "/"
                        ? pathname === "/"
                        : pathname === href || pathname.startsWith(`${href}/`);
                    return (
                      <li key={href}>
                        <Link
                          href={href}
                          className={cn(
                            "block rounded-xl px-4 py-3.5 text-base font-semibold transition-colors touch-manipulation",
                            active
                              ? "bg-white/10 text-amber-300"
                              : "text-zinc-100 hover:bg-white/10 active:bg-white/15",
                          )}
                          onClick={() => setOpen(false)}
                        >
                          {label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
                <p className="mt-auto border-t border-white/10 pt-6 text-xs leading-relaxed text-zinc-500">
                  NHSF (UK) Schools portal
                </p>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
