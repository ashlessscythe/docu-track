import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

// Helper function to check if user has access to the document
async function checkDocumentAccess(documentId: string, session: any) {
  // Get the document with minimal information
  const document = await prisma.document.findUnique({
    where: {
      id: documentId,
    },
    select: {
      submitterId: true,
      departmentId: true,
    },
  });

  if (!document) {
    return false;
  }

  // Admin has access to all documents
  if (session.user.role === "ADMIN") {
    return true;
  }

  // Document submitter has access to their own documents
  if (document.submitterId === session.user.id) {
    return true;
  }

  // Approvers have access only to documents from their department
  if (
    session.user.role === "APPROVER" &&
    document.departmentId === session.user.departmentId
  ) {
    return true;
  }

  // Default: no access
  return false;
}

// GET /api/documents/[id]/comments
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if user has access to the document
    const hasAccess = await checkDocumentAccess(id, session);
    if (!hasAccess) {
      return new NextResponse(
        "Forbidden - You don't have access to this document",
        { status: 403 }
      );
    }

    const comments = await prisma.comment.findMany({
      where: {
        documentId: id,
      },
      include: {
        user: {
          select: {
            name: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// POST /api/documents/[id]/comments
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if user has access to the document
    const hasAccess = await checkDocumentAccess(id, session);
    if (!hasAccess) {
      return new NextResponse(
        "Forbidden - You don't have access to this document",
        { status: 403 }
      );
    }

    const body = await request.json();
    const { content, isSystem = false } = body;

    if (!content) {
      return new NextResponse("Content is required", { status: 400 });
    }

    // Get the user from the database
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email!,
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Create the comment
    const comment = await prisma.comment.create({
      data: {
        content,
        documentId: id,
        userId: user.id,
      },
      include: {
        user: {
          select: {
            name: true,
            role: true,
          },
        },
      },
    });

    return NextResponse.json(comment);
  } catch (error) {
    console.error("Error creating comment:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
