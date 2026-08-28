import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { UserRole } from "@prisma/client";
import { requireRole, getSiteFilter } from "@/lib/api-auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const session = await requireRole([UserRole.REPORTER, UserRole.ADMIN]);
    if (session instanceof NextResponse) return session;

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
    const endDate = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59);

    const siteFilter = getSiteFilter(session);
    const documents = await prisma.document.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
        ...(siteFilter ?? {}),
      },
      select: {
        createdAt: true,
        status: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const dailyStats = documents.reduce(
      (acc, doc) => {
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
      },
      {} as Record<
        number,
        {
          day: number;
          total: number;
          APPROVED: number;
          PENDING: number;
          REJECTED: number;
          NEEDS_REVIEW: number;
        }
      >
    );

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
