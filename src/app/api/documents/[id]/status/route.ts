import { NextResponse } from "next/server";
import {
  requireRole,
  requireSiteAccess,
  parseBody,
} from "@/lib/api-auth";
import { updateDocumentStatusSchema } from "@/lib/schemas";
import { prisma } from "@/lib/prisma";
import { DocumentStatus } from "@prisma/client";
import { sendDocumentActionEmail } from "@/lib/email";

// Helper function to create system comment
async function createSystemComment(
  documentId: string,
  userId: string,
  content: string
) {
  await prisma.comment.create({
    data: {
      content,
      documentId,
      userId,
    },
  });
}

async function handleStatusUpdate(
  request: Request,
  documentId: string
) {
  try {
    const session = await requireRole(["APPROVER", "ADMIN"]);
    if (session instanceof Response) return session;

    if (!documentId) {
      return new NextResponse("Document ID is required", { status: 400 });
    }

    const body = await request.json();
    const parsed = parseBody(updateDocumentStatusSchema, body);
    if (parsed instanceof Response) return parsed;
    const { status } = parsed.data;

    // Verify the document exists and check department access
    const document = await prisma.document.findUnique({
      where: {
        id: documentId,
      },
      include: {
        submitter: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!document) {
      return new NextResponse("Document not found", { status: 404 });
    }

    const siteError = requireSiteAccess(session, document.siteId);
    if (siteError) return siteError;

    // For regular approvers, verify department access
    if (
      session.user.role === "APPROVER" &&
      document.departmentId !== session.user.departmentId
    ) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    // Get user for comment creation
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Create appropriate comment based on status
    let commentContent = "";
    if (status === "APPROVED") {
      commentContent = `Document was approved by ${user.name}`;
    } else if (status === "REJECTED") {
      commentContent = `Document was rejected by ${user.name}`;
    } else if (status === "NEEDS_REVIEW") {
      commentContent = `Document was marked for review by ${user.name}`;
    } else {
      commentContent = `Document status was changed to ${status} by ${user.name}`;
    }

    // Create the system comment
    await createSystemComment(documentId, user.id, commentContent);

    const updatedDocument = await prisma.document.update({
      where: {
        id: documentId,
      },
      data: {
        status: status as DocumentStatus,
        approverId: status === "APPROVED" ? user.id : null,
      },
      include: {
        submitter: {
          select: {
            name: true,
            email: true,
          },
        },
        department: true,
        type: true,
      },
    });

    // Get all comments for the document to include in the email
    const comments = await prisma.comment.findMany({
      where: {
        documentId,
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5, // Limit to the 5 most recent comments
    });

    // Send email notification for status changes that require notification
    if (["APPROVED", "REJECTED", "NEEDS_REVIEW"].includes(status)) {
      // Get base URL for dashboard link
      const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

      // Send email to document submitter
      await sendDocumentActionEmail(updatedDocument, user, comments, baseUrl);
    }

    // Serialize dates before sending response
    const serializedDocument = {
      ...updatedDocument,
      createdAt: updatedDocument.createdAt.toISOString(),
      updatedAt: updatedDocument.updatedAt.toISOString(),
    };

    return NextResponse.json(serializedDocument);
  } catch (error) {
    console.error("Error updating document status:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// Support both PATCH and PUT methods
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return handleStatusUpdate(request, id);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return handleStatusUpdate(request, id);
}
