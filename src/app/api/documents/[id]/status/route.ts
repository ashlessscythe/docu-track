import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DocumentStatus } from "@prisma/client";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  if (session.user.role !== "APPROVER" && session.user.role !== "ADMIN") {
    return new NextResponse("Forbidden", { status: 403 });
  }

  try {
    const { status } = await request.json();

    // Verify the document exists and check department access
    const document = await prisma.document.findUnique({
      where: { id: params.id },
    });

    if (!document) {
      return new NextResponse("Document not found", { status: 404 });
    }

    // For regular approvers, verify department access
    if (
      session.user.role === "APPROVER" &&
      document.departmentId !== session.user.departmentId
    ) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const updatedDocument = await prisma.document.update({
      where: { id: params.id },
      data: {
        status: status as DocumentStatus,
        approverId: status === "APPROVED" ? session.user.id : null,
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
