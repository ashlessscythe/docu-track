import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Get all departments with their documents
    const deptStats = await prisma.department.findMany({
      select: {
        name: true,
        documents: {
          select: {
            status: true,
          },
        },
      },
    });

    // Get documents with no department
    const globalDocs = await prisma.document.findMany({
      where: {
        departmentId: null,
      },
      select: {
        status: true,
      },
    });

    // Transform department data
    const deptData = deptStats.map((dept) => {
      const totalDocs = dept.documents.length;
      const approved = dept.documents.filter(
        (doc) => doc.status === "APPROVED"
      ).length;
      const pending = dept.documents.filter(
        (doc) => doc.status === "PENDING"
      ).length;
      const rejected = dept.documents.filter(
        (doc) => doc.status === "REJECTED"
      ).length;
      const needsReview = dept.documents.filter(
        (doc) => doc.status === "NEEDS_REVIEW"
      ).length;

      return {
        department: dept.name,
        total: totalDocs,
        approved,
        pending,
        rejected,
        needsReview,
      };
    });

    // Add global documents data
    const globalStats = {
      department: null,
      total: globalDocs.length,
      approved: globalDocs.filter((doc) => doc.status === "APPROVED").length,
      pending: globalDocs.filter((doc) => doc.status === "PENDING").length,
      rejected: globalDocs.filter((doc) => doc.status === "REJECTED").length,
      needsReview: globalDocs.filter((doc) => doc.status === "NEEDS_REVIEW")
        .length,
    };

    // Combine department and global data
    const chartData = [...deptData, globalStats];

    return NextResponse.json(chartData);
  } catch (error) {
    console.error("Error fetching document statistics:", error);
    return NextResponse.json(
      { error: "Failed to fetch document statistics" },
      { status: 500 }
    );
  }
}
