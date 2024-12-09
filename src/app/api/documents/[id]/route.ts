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
      return new NextResponse("Unauthorized - Please sign in", { status: 401 });
    }

    // First try to find the document
    const document = await prisma.document.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!document) {
      return new NextResponse("Document not found", { status: 404 });
    }

    // Allow deletion if user is admin or if the document belongs to the user
    if (session.user.role !== "ADMIN") {
      if (document.submitterId !== session.user.id) {
        return new NextResponse(
          "Access denied - Only document owners and administrators can delete documents",
          { status: 401 }
        );
      }
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

    // First find the document
    const document = await prisma.document.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!document) {
      return new NextResponse("Document not found", { status: 404 });
    }

    // Check permissions - allow only admin or document owner
    const isAdmin = session.user.role === "ADMIN";
    const isOwner = document.submitterId === session.user.id;

    if (!isAdmin && !isOwner) {
      return new NextResponse(
        "Access denied - Only document owners and administrators can update documents",
        { status: 401 }
      );
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
