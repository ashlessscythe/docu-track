import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const document = await prisma.document.findUnique({
      where: {
        id: params.id,
        submitterId: session.user.id,
      },
      select: {
        content: true,
        mimeType: true,
        name: true,
      },
    });

    if (!document) {
      return new NextResponse("Document not found", { status: 404 });
    }

    // Set appropriate headers for file download
    const headers = new Headers();
    headers.set("Content-Type", document.mimeType);
    headers.set(
      "Content-Disposition",
      `attachment; filename="${document.name}"`
    );

    return new NextResponse(document.content, {
      headers,
    });
  } catch (error) {
    console.error("[DOCUMENT_DOWNLOAD]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
