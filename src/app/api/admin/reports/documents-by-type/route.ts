import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get user's site ID from session
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { siteId: true },
    });

    if (!user?.siteId) {
      return NextResponse.json(
        { error: "User not associated with a site" },
        { status: 400 }
      );
    }

    // Get all document types with their documents for the user's site
    const typeStats = await prisma.documentType.findMany({
      where: {
        siteId: user.siteId,
      },
      select: {
        id: true,
        name: true,
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
        total: totalDocs,
        approved,
        pending,
        rejected,
        needsReview,
      };
    });

    return NextResponse.json(typeData);
  } catch (error) {
    console.error("Error fetching document type statistics:", error);
    return NextResponse.json(
      { error: "Failed to fetch document type statistics" },
      { status: 500 }
    );
  }
}
