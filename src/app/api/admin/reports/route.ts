import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DocumentStatus, UserRole } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [
      userTotal,
      usersByRole,
      documentTotal,
      docsByStatus,
      docsByDepartmentId,
      departmentTotal,
      departments,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.groupBy({
        by: ["role"],
        _count: { role: true },
      }),
      prisma.document.count(),
      prisma.document.groupBy({
        by: ["status"],
        _count: { status: true },
      }),
      prisma.document.groupBy({
        by: ["departmentId"],
        _count: { id: true },
      }),
      prisma.department.count(),
      prisma.department.findMany({
        select: {
          name: true,
          _count: {
            select: {
              documents: true,
              users: true,
            },
          },
        },
      }),
    ]);

    const roleCounts: Record<UserRole, number> = {
      ADMIN: 0,
      APPROVER: 0,
      SUBMITTER: 0,
      PENDING: 0,
      REPORTER: 0,
    };
    for (const item of usersByRole) {
      roleCounts[item.role] = item._count.role;
    }

    const statusCounts: Record<DocumentStatus, number> = {
      PENDING: 0,
      APPROVED: 0,
      REJECTED: 0,
      NEEDS_REVIEW: 0,
    };
    for (const item of docsByStatus) {
      statusCounts[item.status] = item._count.status;
    }

    const deptIds = docsByDepartmentId
      .map((d) => d.departmentId)
      .filter((id): id is string => id !== null);

    const deptNames =
      deptIds.length > 0
        ? await prisma.department.findMany({
            where: { id: { in: deptIds } },
            select: { id: true, name: true },
          })
        : [];

    const deptNameMap = new Map(deptNames.map((d) => [d.id, d.name]));

    const byDepartment: Record<string, number> = {};
    for (const item of docsByDepartmentId) {
      const deptName = item.departmentId
        ? deptNameMap.get(item.departmentId) || "Unknown Department"
        : "No Department";
      byDepartment[deptName] =
        (byDepartment[deptName] || 0) + item._count.id;
    }

    return NextResponse.json({
      users: {
        total: userTotal,
        byRole: {
          ADMIN: roleCounts.ADMIN,
          APPROVER: roleCounts.APPROVER,
          SUBMITTER: roleCounts.SUBMITTER,
          PENDING: roleCounts.PENDING,
        },
      },
      documents: {
        total: documentTotal,
        byStatus: {
          PENDING: statusCounts.PENDING,
          APPROVED: statusCounts.APPROVED,
          REJECTED: statusCounts.REJECTED,
          NEEDS_REVIEW: statusCounts.NEEDS_REVIEW,
        },
        byDepartment,
      },
      departments: {
        total: departmentTotal,
        documentsPerDepartment: departments.reduce(
          (acc, dept) => {
            acc[dept.name] = dept._count.documents;
            return acc;
          },
          {} as Record<string, number>
        ),
        usersPerDepartment: departments.reduce(
          (acc, dept) => {
            acc[dept.name] = dept._count.users;
            return acc;
          },
          {} as Record<string, number>
        ),
      },
    });
  } catch (error) {
    console.error("Failed to generate reports:", error);
    return NextResponse.json(
      { error: "Failed to generate reports" },
      { status: 500 }
    );
  }
}
