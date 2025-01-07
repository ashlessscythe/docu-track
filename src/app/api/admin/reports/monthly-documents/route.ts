import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// Mark route as dynamic
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get("month");
    const year = searchParams.get("year");

    if (!month || !year) {
      return NextResponse.json(
        { error: "Month and year are required" },
        { status: 400 }
      );
    }

    const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
    const endDate = new Date(parseInt(year), parseInt(month), 0);

    const documents = await prisma.document.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        createdAt: true,
        status: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Group documents by day
    const dailyStats = documents.reduce((acc, doc) => {
      const day = doc.createdAt.getDate();
      if (!acc[day]) {
        acc[day] = {
          day,
          total: 0,
          APPROVED: 0,
          PENDING: 0,
          REJECTED: 0,
          NEEDS_REVIEW: 0,
        };
      }
      acc[day].total++;
      acc[day][doc.status]++;
      return acc;
    }, {} as Record<number, any>);

    // Convert to array and fill in missing days
    const daysInMonth = endDate.getDate();
    const result = Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      return (
        dailyStats[day] || {
          day,
          total: 0,
          APPROVED: 0,
          PENDING: 0,
          REJECTED: 0,
          NEEDS_REVIEW: 0,
        }
      );
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching monthly document statistics:", error);
    return NextResponse.json(
      { error: "Failed to fetch monthly document statistics" },
      { status: 500 }
    );
  }
}
