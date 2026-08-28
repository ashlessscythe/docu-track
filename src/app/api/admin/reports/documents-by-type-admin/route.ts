import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all document types with their documents
    const typeStats = await prisma.documentType.findMany({
      select: {
        id: true,
        name: true,
        siteId: true,
        site: {
          select: {
            name: true,
          },
        },
        documents: {
          select: {
            status: true,
          },
        },
      },
    });

    // Transform document type data
    const typeData = typeStats.map((type) => {
      const totalDocs = type.documents.length;
      const approved = type.documents.filter(
        (doc) => doc.status === "APPROVED"
      ).length;
      const pending = type.documents.filter(
        (doc) => doc.status === "PENDING"
      ).length;
      const rejected = type.documents.filter(
        (doc) => doc.status === "REJECTED"
      ).length;
      const needsReview = type.documents.filter(
        (doc) => doc.status === "NEEDS_REVIEW"
      ).length;

      return {
        type: type.name,
        typeId: type.id,
        site: type.site.name,
        siteId: type.siteId,
        total: totalDocs,
        approved,
        pending,
        rejected,
        needsReview,
      };
    });

    // Group by site for easier consumption
    const groupedByType = typeData.reduce(
      (acc, item) => {
        if (!acc[item.site]) {
          acc[item.site] = [];
        }
        acc[item.site].push(item);
        return acc;
      },
      {} as Record<string, typeof typeData>
    );

    return NextResponse.json({
      byType: typeData,
      bySite: groupedByType,
    });
  } catch (error) {
    console.error("Error fetching document type statistics:", error);
    return NextResponse.json(
      { error: "Failed to fetch document type statistics" },
      { status: 500 }
    );
  }
}
