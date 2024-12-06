import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Verify the document belongs to the user
    const document = await prisma.document.findUnique({
      where: {
        id: params.id,
        submitterId: session.user.id,
      },
    });

    if (!document) {
      return new NextResponse("Document not found", { status: 404 });
    }

    await prisma.document.delete({
      where: {
        id: params.id,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[DOCUMENT_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    // Verify the document belongs to the user
    const document = await prisma.document.findUnique({
      where: {
        id: params.id,
        submitterId: session.user.id,
      },
    });

    if (!document) {
      return new NextResponse("Document not found", { status: 404 });
    }

    if (!file) {
      return new NextResponse("No file provided", { status: 400 });
    }

    // Use the original filename from the uploaded file
    const originalFilename = file.name;

    // Convert file to Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    const updatedDocument = await prisma.document.update({
      where: {
        id: params.id,
      },
      data: {
        name: originalFilename, // Update the name to the new file's name
        content: buffer,
        mimeType: file.type,
        status: "PENDING", // Reset status when document is updated
      },
    });

    return NextResponse.json(updatedDocument);
  } catch (error) {
    console.error("[DOCUMENT_UPDATE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
