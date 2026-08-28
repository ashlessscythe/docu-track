import { NextResponse } from "next/server";
import { getServerSession, Session } from "next-auth";
import { UserRole } from "@prisma/client";
import { ZodSchema } from "zod";
import { authOptions } from "@/lib/auth";

export type AuthSession = Session;

export async function requireSession(): Promise<AuthSession | NextResponse> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return session;
}

export async function requireRole(
  roles: UserRole[]
): Promise<AuthSession | NextResponse> {
  const session = await requireSession();
  if (session instanceof NextResponse) return session;

  if (!roles.includes(session.user.role as UserRole)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return session;
}

export async function requireAdmin(): Promise<AuthSession | NextResponse> {
  return requireRole([UserRole.ADMIN]);
}

import { isSameSite } from "@/lib/site-access";

export function requireSiteAccess(
  session: AuthSession,
  resourceSiteId: string | null | undefined
): NextResponse | null {
  const userSiteId = session.user.siteId;
  if (!userSiteId) {
    return NextResponse.json(
      { error: "User is not assigned to a site" },
      { status: 403 }
    );
  }
  if (!isSameSite(userSiteId, resourceSiteId)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return null;
}

export function parseBody<T>(
  schema: ZodSchema<T>,
  body: unknown
): { data: T } | NextResponse {
  const result = schema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: "Validation failed", details: result.error.flatten() },
      { status: 400 }
    );
  }
  return { data: result.data };
}

export function getSiteFilter(session: AuthSession) {
  return session.user.siteId ? { siteId: session.user.siteId } : null;
}
