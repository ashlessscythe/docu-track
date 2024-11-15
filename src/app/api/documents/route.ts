import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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
          : {
              submitterId: session.user.id,
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
    const name = formData.get("name") as string;
    const type = formData.get("type") as string;
    const description = formData.get("description") as string;
    const department = formData.get("department") as string;
    const file = formData.get("file") as Blob;

    if (!name || !type || !description || !department || !file) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Convert file to Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    const document = await prisma.document.create({
      data: {
        name,
        type,
        description,
        department,
        status: "PENDING",
        content: buffer,
        mimeType: file.type,
        submitter: {
          connect: {
            id: session.user.id,
          },
        },
      },
    });

    return NextResponse.json(document);
  } catch (error) {
    console.error("[DOCUMENTS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
