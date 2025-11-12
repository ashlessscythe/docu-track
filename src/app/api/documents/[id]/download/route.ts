import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Block PENDING users from downloading documents
    if (session.user.role === "PENDING") {
      return new NextResponse(
        "Access denied. Your account is pending approval.",
        { status: 403 }
      );
    }

    // First check if user has access to this document
    const document = await prisma.document.findUnique({
      where: {
        id: id,
      },
      select: {
        submitterId: true,
        departmentId: true,
        siteId: true,
      },
    });

    if (!document) {
      return new NextResponse("Document not found", { status: 404 });
    }

    // Check if user has access to this document
    // Admin has access to all documents
    // Document submitter has access to their own documents
    // Approvers have access only to documents from their department
    const hasAccess =
      session.user.role === "ADMIN" ||
      document.submitterId === session.user.id ||
      (session.user.role === "APPROVER" &&
        document.departmentId === session.user.departmentId);

    if (!hasAccess) {
      return new NextResponse(
        "Forbidden - You don't have access to this document",
        { status: 403 }
      );
    }

    // If user has access, get the document content
    const documentWithContent = await prisma.document.findUnique({
      where: {
        id: id,
      },
      select: {
        content: true,
        mimeType: true,
        name: true,
      },
    });

    if (!documentWithContent || !documentWithContent.content) {
      return new NextResponse("Document content not found", { status: 404 });
    }

    // Set appropriate headers for file download
    const headers = new Headers();
    headers.set("Content-Type", documentWithContent.mimeType);
    headers.set(
      "Content-Disposition",
      `attachment; filename="${documentWithContent.name}"`
    );

    return new NextResponse(documentWithContent.content, {
      headers,
    });
  } catch (error) {
    console.error("[DOCUMENT_DOWNLOAD]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
