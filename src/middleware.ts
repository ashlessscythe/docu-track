import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Public paths that don't require authentication
    if (path.startsWith("/auth")) {
      return NextResponse.next();
    }

    // Ensure user is authenticated
    if (!token) {
      return NextResponse.redirect(new URL("/auth/signin", req.url));
    }

    // Admin only paths
    if (path.startsWith("/admin") && token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    // Approver only paths (allow ADMIN as well)
    if (
      path.startsWith("/approver") &&
      token.role !== "APPROVER" &&
      token.role !== "ADMIN"
    ) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    // Submitter only paths (allow ADMIN as well)
    if (
      path.startsWith("/submitter") &&
      token.role !== "SUBMITTER" &&
      token.role !== "ADMIN"
    ) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

// Specify which routes to protect
export const config = {
  matcher: [
    "/admin/:path*",
    "/approver/:path*",
    "/submitter/:path*",
    "/api/documents/:path*",
  ],
};
