import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { stackServerApp } from "@/stack";

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Allow access to home page without authentication
  if (path === "/") {
    return NextResponse.next();
  }

  // Allow access to auth-related paths
  if (
    path.startsWith("/handler") ||
    path.startsWith("/signin") ||
    path.startsWith("/register") ||
    path.startsWith("/forgot-password") ||
    path.startsWith("/reset-password")
  ) {
    return NextResponse.next();
  }

  try {
    // Get the user from Stack Auth
    const user = await stackServerApp.getUser();

    if (!user) {
      // Redirect to sign in if no user
      return NextResponse.redirect(new URL("/handler/sign-in", req.url));
    }

    // Check user permissions based on roles
    const isAdmin = await user.getPermission("ADMIN");
    const isApprover = await user.getPermission("APPROVER");
    const isSubmitter = await user.getPermission("SUBMITTER");
    const isPending = await user.getPermission("PENDING");
    const isReporter = await user.getPermission("REPORTER");

    // Admin has access to everything
    if (isAdmin) {
      return NextResponse.next();
    }

    // Redirect pending users to pending page
    if (isPending) {
      if (path !== "/pending") {
        return NextResponse.redirect(new URL("/pending", req.url));
      }
      return NextResponse.next();
    }

    // Allow all authenticated non-pending users to access dashboard
    if (path === "/dashboard") {
      return NextResponse.next();
    }

    // Allow REPORTER role access to reports
    if (isReporter && path.startsWith("/reports")) {
      return NextResponse.next();
    }

    // Allow users to access their own role-specific pages
    if (
      (isApprover && path.startsWith("/approver")) ||
      (isSubmitter && path.startsWith("/submitter"))
    ) {
      return NextResponse.next();
    }

    // Protect role-specific pages from other roles
    if (
      path.startsWith("/approver") ||
      path.startsWith("/submitter") ||
      path.startsWith("/reports") ||
      path.startsWith("/admin")
    ) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    return NextResponse.next();
  } catch (error) {
    // If there's an error with authentication, redirect to sign in
    console.error("Middleware authentication error:", error);
    return NextResponse.redirect(new URL("/handler/sign-in", req.url));
  }
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
    "/unauthorized",
    "/api/:path*",
  ],
};
