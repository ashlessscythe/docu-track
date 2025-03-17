import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get user's site ID, default to null if not set
    const siteId = session.user.siteId || null;

    // If no site ID is set, return empty array as user must have a site
    if (!siteId) {
      return NextResponse.json([]);
    }

    const documentTypes = await prisma.documentType.findMany({
      where: {
        siteId, // Filter by user's site
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(documentTypes);
  } catch (error) {
    console.error("[DOCUMENT_TYPES_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get user's site ID, default to null if not set
    const siteId = session.user.siteId;

    // If no site ID is set, return error as user must have a site
    if (!siteId) {
      return new NextResponse("User not associated with a site", {
        status: 400,
      });
    }

    const body = await req.json();
    const { name, description } = body;

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    // Check if document type with same name already exists in this site
    const existingDocumentType = await prisma.documentType.findFirst({
      where: {
        name,
        siteId,
      },
    });

    if (existingDocumentType) {
      return new NextResponse("Document type with this name already exists", {
        status: 400,
      });
    }

    const documentType = await prisma.documentType.create({
      data: {
        name,
        description,
        siteId, // Set the site ID from the user's session
      },
    });

    return NextResponse.json(documentType);
  } catch (error) {
    console.error("[DOCUMENT_TYPES_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
