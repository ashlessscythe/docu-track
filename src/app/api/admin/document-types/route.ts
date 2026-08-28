import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET /api/admin/document-types - Get all document types
export async function GET() {
  try {
    const session = await requireAdmin();
    if (session instanceof Response) return session;

    const siteId = session.user.siteId;
    if (!siteId) {
      return NextResponse.json([]);
    }

    const documentTypes = await prisma.documentType.findMany({
      where: { siteId },
      select: {
        id: true,
        name: true,
        description: true,
      },
    });

    // Parse the JSON description and format the response
    const formattedTypes = documentTypes.map((type) => {
      try {
        const descriptionData = JSON.parse(
          type.description || '{"text": "", "type": "default"}'
        );
        return {
          id: type.id,
          name: type.name,
          description: descriptionData.text,
          type: descriptionData.type,
        };
      } catch (e) {
        // If parsing fails, return the description as is (for backward compatibility)
        return {
          id: type.id,
          name: type.name,
          description: type.description || "",
          type: "default",
        };
      }
    });

    return NextResponse.json(formattedTypes);
  } catch (error) {
    console.error("Failed to fetch document types:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// POST /api/admin/document-types - Create a new document type
export async function POST(request: Request) {
  try {
    const session = await requireAdmin();
    if (session instanceof Response) return session;

    const adminSiteId = session.user.siteId;
    if (!adminSiteId) {
      return new NextResponse("Admin must be assigned to a site", {
        status: 403,
      });
    }

    const body = await request.json();
    const {
      name,
      description,
      type = "default",
      siteId = adminSiteId,
      ...otherFields
    } = body;

    if (siteId !== adminSiteId) {
      return new NextResponse("Cannot create document types for other sites", {
        status: 403,
      });
    }

    if (!name) {
      return new NextResponse("Document type name is required", {
        status: 400,
      });
    }

    const existingType = await prisma.documentType.findFirst({
      where: {
        name,
        siteId,
      },
    });

    if (existingType) {
      return new NextResponse(
        "Document type with this name already exists in this site",
        {
          status: 400,
        }
      );
    }

    // Store type and other fields in description as JSON
    const descriptionData = {
      text: description || "",
      type,
      ...otherFields,
    };

    const documentType = await prisma.documentType.create({
      data: {
        name,
        description: JSON.stringify(descriptionData),
        siteId,
      },
    });

    // Format response to match DocumentType type
    const response: DocumentType = {
      id: documentType.id,
      name: documentType.name,
      description: descriptionData.text,
      type: descriptionData.type,
      ...otherFields,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Failed to create document type:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
