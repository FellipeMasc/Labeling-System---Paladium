import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function middleware(request: NextRequest) {
  if (
    request.nextUrl.pathname.startsWith("/api") ||
    request.nextUrl.pathname.startsWith("/_next") ||
    request.nextUrl.pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const pathname = request.nextUrl.pathname;
  const isLoginRoute = pathname === "/login" || pathname.startsWith("/login/");
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");

  const privateRoutes = ["/"];

  const isPrivateRoute = privateRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`));

  if (!isPrivateRoute && !isLoginRoute && !isAdminRoute) {
    return NextResponse.next();
  }

  const sessionCookie =
    request.cookies.get("better-auth.session_token")?.value ||
    request.cookies.get("__Secure-better-auth.session_token")?.value;

  const isAuthenticated = !!sessionCookie && sessionCookie?.split(".")[0];

  // Admin route protection
  if (isAdminRoute) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    const adminRes = await fetch(`http://${request.nextUrl.host}/api/auth/verify-admin`, {
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    });
    if (adminRes.status !== 200) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }
  console.log(isAuthenticated);
  if (isPrivateRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthenticated && !isAdminRoute) {
    const adminRes = await fetch(`http://${request.nextUrl.host}/api/auth/verify-admin`, {
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    });
    if (adminRes.status === 200) {
      return NextResponse.redirect(new URL("/admin", request.url));
    } else {
      if (isLoginRoute) {
        return NextResponse.redirect(new URL("/", request.url));
      }
      return NextResponse.next();
    }
  }

  if (isAuthenticated && isLoginRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login/:path*", "/admin/:path*"],
};
