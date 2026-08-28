import { NextResponse } from "next/server";
import { UserRole, DocumentStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireRole, getSiteFilter, AuthSession } from "@/lib/api-auth";

export const dynamic = "force-dynamic";

function buildDocumentWhere(session: AuthSession) {
  const siteFilter = getSiteFilter(session);
  return siteFilter ? { ...siteFilter } : {};
}

function calcApprovalRate(approved: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((approved / total) * 1000) / 10;
}

function calcMomChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 1000) / 10;
}

const STATUS_LABELS: Record<DocumentStatus, string> = {
  APPROVED: "Approved",
  PENDING: "Pending",
  REJECTED: "Rejected",
  NEEDS_REVIEW: "Needs Review",
};

export async function GET() {
  try {
    const session = await requireRole([UserRole.REPORTER, UserRole.ADMIN]);
    if (session instanceof NextResponse) return session;

    const where = buildDocumentWhere(session);

    const documents = await prisma.document.findMany({
      where,
      select: {
        status: true,
        createdAt: true,
        updatedAt: true,
        department: { select: { name: true } },
      },
    });

    const totalDocuments = documents.length;
    const approved = documents.filter((d) => d.status === "APPROVED").length;
    const rejected = documents.filter((d) => d.status === "REJECTED").length;
    const pending = documents.filter((d) => d.status === "PENDING").length;
    const needsReview = documents.filter(
      (d) => d.status === "NEEDS_REVIEW"
    ).length;
    const activeBacklog = pending + needsReview;
    const approvalRate = calcApprovalRate(approved, totalDocuments);
    const rejectionRate = calcApprovalRate(rejected, totalDocuments);

    const approvedDocs = documents.filter(
      (d) => d.status === "APPROVED" && d.updatedAt > d.createdAt
    );
    let avgProcessingDays: number | null = null;
    if (approvedDocs.length > 0) {
      const totalDays = approvedDocs.reduce((sum, d) => {
        return (
          sum +
          (d.updatedAt.getTime() - d.createdAt.getTime()) /
            (1000 * 60 * 60 * 24)
        );
      }, 0);
      avgProcessingDays = Math.round((totalDays / approvedDocs.length) * 10) / 10;
    }

    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevMonthEnd = new Date(
      now.getFullYear(),
      now.getMonth(),
      0,
      23,
      59,
      59
    );

    const currentMonthDocs = documents.filter(
      (d) => d.createdAt >= currentMonthStart
    );
    const prevMonthDocs = documents.filter(
      (d) => d.createdAt >= prevMonthStart && d.createdAt <= prevMonthEnd
    );

    const currentMonthApproved = currentMonthDocs.filter(
      (d) => d.status === "APPROVED"
    ).length;
    const prevMonthApproved = prevMonthDocs.filter(
      (d) => d.status === "APPROVED"
    ).length;
    const currentMonthRate = calcApprovalRate(
      currentMonthApproved,
      currentMonthDocs.length
    );
    const prevMonthRate = calcApprovalRate(
      prevMonthApproved,
      prevMonthDocs.length
    );

    const momChange = {
      submissions: calcMomChange(
        currentMonthDocs.length,
        prevMonthDocs.length
      ),
      approvalRate: Math.round((currentMonthRate - prevMonthRate) * 10) / 10,
    };

    const statusCounts: Record<DocumentStatus, number> = {
      PENDING: pending,
      APPROVED: approved,
      REJECTED: rejected,
      NEEDS_REVIEW: needsReview,
    };

    const statusDistribution = (
      Object.entries(statusCounts) as [DocumentStatus, number][]
    ).map(([status, count]) => ({
      status: STATUS_LABELS[status],
      count,
      percentage:
        totalDocuments > 0
          ? Math.round((count / totalDocuments) * 1000) / 10
          : 0,
    }));

    const deptMap = new Map<string, { approved: number; total: number }>();
    for (const doc of documents) {
      const deptName = doc.department?.name ?? "Global (No dept)";
      const entry = deptMap.get(deptName) ?? { approved: 0, total: 0 };
      entry.total++;
      if (doc.status === "APPROVED") entry.approved++;
      deptMap.set(deptName, entry);
    }

    const approvalRateByDepartment = Array.from(deptMap.entries())
      .map(([department, { approved: deptApproved, total }]) => ({
        department,
        rate: calcApprovalRate(deptApproved, total),
        total,
      }))
      .sort((a, b) => a.rate - b.rate);

    const monthlyTrends = [];
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(
        now.getFullYear(),
        now.getMonth() - i + 1,
        0,
        23,
        59,
        59
      );
      const monthLabel = monthDate.toLocaleString("default", {
        month: "short",
        year: "numeric",
      });

      const monthDocs = documents.filter(
        (d) => d.createdAt >= monthDate && d.createdAt <= monthEnd
      );
      const monthApproved = monthDocs.filter(
        (d) => d.status === "APPROVED"
      ).length;

      monthlyTrends.push({
        month: monthLabel,
        submissions: monthDocs.length,
        approvalRate: calcApprovalRate(monthApproved, monthDocs.length),
      });
    }

    return NextResponse.json({
      kpis: {
        totalDocuments,
        approvalRate,
        rejectionRate,
        activeBacklog,
        avgProcessingDays,
        momChange,
      },
      statusDistribution,
      approvalRateByDepartment,
      monthlyTrends,
    });
  } catch (error) {
    console.error("Error fetching executive summary:", error);
    return NextResponse.json(
      { error: "Failed to fetch executive summary" },
      { status: 500 }
    );
  }
}
