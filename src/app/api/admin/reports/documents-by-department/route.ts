import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Get documents grouped by department with status counts
    const stats = await prisma.department.findMany({
      select: {
        name: true,
        documents: {
          select: {
            status: true,
          },
        },
      },
    });

    // Transform the data for the chart
    const chartData = stats.map((dept) => {
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

    return NextResponse.json(chartData);
  } catch (error) {
    console.error("Error fetching document statistics:", error);
    return NextResponse.json(
      { error: "Failed to fetch document statistics" },
      { status: 500 }
    );
  }
}
