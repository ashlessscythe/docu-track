import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { UserRole } from "@prisma/client";
import { requireRole, getSiteFilter } from "@/lib/api-auth";

export const dynamic = "force-dynamic";

function countByStatus(docs: { status: string }[]) {
  return {
    total: docs.length,
    approved: docs.filter((d) => d.status === "APPROVED").length,
    pending: docs.filter((d) => d.status === "PENDING").length,
    rejected: docs.filter((d) => d.status === "REJECTED").length,
    needsReview: docs.filter((d) => d.status === "NEEDS_REVIEW").length,
  };
}

export async function GET() {
  try {
    const session = await requireRole([UserRole.REPORTER, UserRole.ADMIN]);
    if (session instanceof NextResponse) return session;

    const siteFilter = getSiteFilter(session);
    const deptWhere = siteFilter ? { siteId: siteFilter.siteId } : {};
    const globalDocWhere = siteFilter
      ? { departmentId: null, siteId: siteFilter.siteId }
      : { departmentId: null };

    const [deptStats, globalDocs] = await Promise.all([
      prisma.department.findMany({
        where: deptWhere,
        select: {
          name: true,
          documents: {
            select: { status: true },
          },
        },
      }),
      prisma.document.findMany({
        where: globalDocWhere,
        select: { status: true },
      }),
    ]);

    const deptData = deptStats.map((dept) => ({
      department: dept.name,
      ...countByStatus(dept.documents),
    }));

    const globalStats = {
      department: null as string | null,
      ...countByStatus(globalDocs),
    };

    return NextResponse.json([...deptData, globalStats]);
  } catch (error) {
    console.error("Error fetching document statistics:", error);
    return NextResponse.json(
      { error: "Failed to fetch document statistics" },
      { status: 500 }
    );
  }
}
