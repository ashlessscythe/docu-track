import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const path = req.nextUrl.pathname;

  // Allow access to home page and auth pages without a token
  if (
    path === "/" ||
    path.startsWith("/signin") ||
    path.startsWith("/register") ||
    path.startsWith("/forgot-password") ||
    path.startsWith("/reset-password") ||
    path.startsWith("/api/auth")
  ) {
    return NextResponse.next();
  }

  // Check if token has error flag and redirect to signin
  if (token?.error === "RefetchUser") {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  // Require authentication for protected routes
  if (!token) {
    const signInUrl = new URL("/signin", req.url);
    signInUrl.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(signInUrl);
  }

  // Handle role-based access
  if (token.role) {
    // Admin has access to everything
    if (token.role === "ADMIN") {
      return NextResponse.next();
    }

    // Redirect pending users to pending page (except for pending page itself and API auth routes)
    if (token.role === "PENDING") {
      // Block PENDING users from accessing API routes (except auth routes)
      if (path.startsWith("/api/") && !path.startsWith("/api/auth")) {
        return NextResponse.json(
          { error: "Access denied. Account pending approval." },
          { status: 403 }
        );
      }
      // Allow access to pending page
      if (path === "/pending" || path.startsWith("/pending/")) {
        return NextResponse.next();
      }
      // Redirect all other pages to pending
      return NextResponse.redirect(new URL("/pending", req.url));
    }

    // Allow all authenticated non-pending users to access dashboard
    if (path === "/dashboard") {
      return NextResponse.next();
    }

    // Allow REPORTER role access to reports
    if (token.role === "REPORTER" && path.startsWith("/reports")) {
      return NextResponse.next();
    }

    // Allow users to access their own role-specific pages
    if (path.startsWith(`/${token.role.toLowerCase()}`)) {
      return NextResponse.next();
    }

    // Protect role-specific pages from other roles
    if (
      path.startsWith("/approver") ||
      path.startsWith("/submitter") ||
      path.startsWith("/reports")
    ) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/dashboard",
    "/admin/:path*",
    "/approver/:path*",
    "/submitter/:path*",
    "/pending/:path*",
    "/reports/:path*",
    "/templates/:path*",
    "/contact/:path*",
    "/user/:path*",
    "/unauthorized",
    "/api/:path*",
  ],
};
