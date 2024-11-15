import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get user statistics
    const users = await prisma.user.findMany();
    const userStats = {
      total: users.length,
      byRole: {
        ADMIN: users.filter((u) => u.role === "ADMIN").length,
        APPROVER: users.filter((u) => u.role === "APPROVER").length,
        SUBMITTER: users.filter((u) => u.role === "SUBMITTER").length,
        PENDING: users.filter((u) => u.role === "PENDING").length,
      },
    };

    // Get document statistics
    const documents = await prisma.document.findMany({
      include: {
        department: true,
      },
    });
    const documentStats = {
      total: documents.length,
      byStatus: {
        PENDING: documents.filter((d) => d.status === "PENDING").length,
        APPROVED: documents.filter((d) => d.status === "APPROVED").length,
        REJECTED: documents.filter((d) => d.status === "REJECTED").length,
        NEEDS_REVIEW: documents.filter((d) => d.status === "NEEDS_REVIEW")
          .length,
      },
      byDepartment: documents.reduce((acc, doc) => {
        const deptName = doc.department?.name || "No Department";
        acc[deptName] = (acc[deptName] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    };

    // Get department statistics
    const departments = await prisma.department.findMany({
      include: {
        users: true,
        documents: true,
      },
    });
    const departmentStats = {
      total: departments.length,
      documentsPerDepartment: departments.reduce((acc, dept) => {
        acc[dept.name] = dept.documents.length;
        return acc;
      }, {} as Record<string, number>),
      usersPerDepartment: departments.reduce((acc, dept) => {
        acc[dept.name] = dept.users.length;
        return acc;
      }, {} as Record<string, number>),
    };

    return NextResponse.json({
      users: userStats,
      documents: documentStats,
      departments: departmentStats,
    });
  } catch (error) {
    console.error("Failed to generate reports:", error);
    return new NextResponse("Failed to generate reports", { status: 500 });
  }
}
