import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Allow access to home page without a token
    if (path === "/") {
      return NextResponse.next();
    }

    // Handle role-based access
    if (token?.role) {
      // Admin has access to everything
      if (token.role === "ADMIN") {
        return NextResponse.next();
      }

      // Redirect pending users to pending page
      if (token.role === "PENDING") {
        if (path !== "/pending") {
          return NextResponse.redirect(new URL("/pending", req.url));
        }
        return NextResponse.next();
      }

      // Allow all authenticated non-pending users to access dashboard
      if (path === "/dashboard") {
        return NextResponse.next();
      }

      // Allow users to access their own role-specific pages
      if (path.startsWith(`/${token.role.toLowerCase()}`)) {
        return NextResponse.next();
      }

      // Protect role-specific pages from other roles
      if (path.startsWith("/approver") || path.startsWith("/submitter")) {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to home page and auth pages without a token
        if (
          req.nextUrl.pathname === "/" ||
          req.nextUrl.pathname.startsWith("/signin") ||
          req.nextUrl.pathname.startsWith("/register")
        ) {
          return true;
        }
        // Require token for all other pages
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    "/",
    "/dashboard",
    "/admin/:path*",
    "/approver/:path*",
    "/submitter/:path*",
    "/pending/:path*",
    "/unauthorized",
  ],
};
