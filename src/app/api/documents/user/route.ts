import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const documents = await prisma.document.findMany({
      where: {
        submitter: {
          email: session.user.email,
        },
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
        type: {
          select: {
            id: true,
            name: true,
          },
        },
        department: {
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

    return NextResponse.json(documents);
  } catch (error) {
    console.error("[DOCUMENTS_USER_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
