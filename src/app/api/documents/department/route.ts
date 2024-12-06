import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  if (session.user.role !== "APPROVER" && session.user.role !== "ADMIN") {
    return new NextResponse("Forbidden", { status: 403 });
  }

  try {
    const documents = await prisma.document.findMany({
      where:
        session.user.role === "ADMIN"
          ? {} // No department filter for admins
          : {
              departmentId: session.user.departmentId, // Filter by department for regular approvers
            },
      select: {
        id: true,
        name: true,
        description: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        mimeType: true,
        submitter: {
          select: {
            name: true,
            email: true,
          },
        },
        department: {
          select: {
            id: true,
            name: true,
          },
        },
        type: {
          select: {
            id: true,
            name: true,
          },
        },
        departmentId: true,
        typeId: true,
        submitterId: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Convert dates to ISO strings before sending
    const serializedDocuments = documents.map((doc) => ({
      ...doc,
      createdAt: doc.createdAt.toISOString(),
      updatedAt: doc.updatedAt.toISOString(),
    }));

    return NextResponse.json(serializedDocuments);
  } catch (error) {
    console.error("Error fetching department documents:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
