import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// PATCH /api/admin/document-types/[id] - Update document type
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { name, description, type = "default", ...otherFields } = body;

    if (!name) {
      return new NextResponse("Document type name is required", {
        status: 400,
      });
    }

    // Check if another document type already has this name
    const existingType = await prisma.documentType.findFirst({
      where: {
        name,
        NOT: {
          id: params.id,
        },
      },
    });

    if (existingType) {
      return new NextResponse("Document type with this name already exists", {
        status: 400,
      });
    }

    // Store type and other fields in description as JSON
    const descriptionData = {
      text: description || "",
      type,
      ...otherFields,
    };

    const documentType = await prisma.documentType.update({
      where: { id: params.id },
      data: {
        name,
        description: JSON.stringify(descriptionData),
      },
    });

    // Format response to match DocumentType type
    const response = {
      id: documentType.id,
      name: documentType.name,
      description: descriptionData.text,
      type: descriptionData.type,
      ...otherFields,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Failed to update document type:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// DELETE /api/admin/document-types/[id] - Delete document type
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if there are any documents using this type
    const documentsUsingType = await prisma.document.findFirst({
      where: { typeId: params.id },
    });

    if (documentsUsingType) {
      return new NextResponse(
        "Cannot delete document type that is being used by documents. Please reassign or delete the documents first.",
        { status: 400 }
      );
    }

    await prisma.documentType.delete({
      where: { id: params.id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Failed to delete document type:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
