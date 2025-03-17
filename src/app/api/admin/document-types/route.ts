import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { DocumentType } from "@/types";

export const dynamic = "force-dynamic";

// Default site ID (matches the one created in the migration)
const DEFAULT_SITE_ID = "default-site-id";

// GET /api/admin/document-types - Get all document types
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const documentTypes = await prisma.documentType.findMany({
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
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      description,
      type = "default",
      siteId = DEFAULT_SITE_ID,
      ...otherFields
    } = body;

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
