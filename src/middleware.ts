import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isEmailAllowedAdmin } from "@/lib/admin-auth-policy";
import { updateSession } from "@/utils/supabase/middleware";

function copySetCookieHeaders(from: NextResponse, to: NextResponse) {
  const getSetCookie = from.headers.getSetCookie?.();
  if (getSetCookie?.length) {
    for (const cookie of getSetCookie) {
      to.headers.append("Set-Cookie", cookie);
    }
    return;
  }
  const raw = from.headers.get("set-cookie");
  if (raw) {
    to.headers.append("Set-Cookie", raw);
  }
}

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request);
  const { pathname } = request.nextUrl;

  const isProtectedAdminRoute =
    pathname.startsWith("/admin") || pathname.startsWith("/api/admin");

  if (!isProtectedAdminRoute) {
    return supabaseResponse;
  }

  const allowed = user ? isEmailAllowedAdmin(user.email) : false;

  if (pathname === "/admin/login") {
    if (user && allowed) {
      const next = request.nextUrl.searchParams.get("next");
      const dest =
        next &&
        ((next.startsWith("/admin") && !next.startsWith("/admin/login")) ||
          next.startsWith("/api/admin"))
          ? next
          : "/admin";
      const redirectRes = NextResponse.redirect(new URL(dest, request.url));
      copySetCookieHeaders(supabaseResponse, redirectRes);
      return redirectRes;
    }
    return supabaseResponse;
  }

  if (!user || !allowed) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    if (!user) {
      url.searchParams.set("next", pathname);
    } else {
      url.searchParams.set("error", "forbidden");
    }
    const redirectRes = NextResponse.redirect(url);
    copySetCookieHeaders(supabaseResponse, redirectRes);
    return redirectRes;
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
