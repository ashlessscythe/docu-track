import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DocumentStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const documents = await prisma.document.findMany({
      where:
        session.user.role === "ADMIN"
          ? {}
          : session.user.role === "APPROVER" && session.user.departmentId
          ? {
              departmentId: session.user.departmentId,
            }
          : {
              submitterId: session.user.id,
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
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(documents);
  } catch (error) {
    console.error("[DOCUMENTS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const formData = await req.formData();
    const typeId = formData.get("typeId") as string;
    const description = formData.get("description") as string;
    const departmentId = formData.get("departmentId") as string | null;
    const file = formData.get("file") as File;

    if (!typeId || !description || !file) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Use the original filename from the uploaded file
    const originalFilename = file.name;

    // Convert file to Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    const document = await prisma.document.create({
      data: {
        name: originalFilename, // Use original filename
        typeId,
        description,
        departmentId: session.user.role === "PENDING" ? null : departmentId,
        status: DocumentStatus.PENDING,
        content: buffer,
        mimeType: file.type,
        submitterId: session.user.id,
      },
      include: {
        department: true,
        type: true,
      },
    });

    return NextResponse.json(document);
  } catch (error) {
    console.error("[DOCUMENTS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
