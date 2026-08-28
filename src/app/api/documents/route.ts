import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DocumentStatus } from "@prisma/client";

import { validateFileUpload, sanitizeFilename } from "@/lib/schemas";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Block PENDING users from accessing documents
    if (session.user.role === "PENDING") {
      return new NextResponse(
        "Access denied. Your account is pending approval.",
        { status: 403 }
      );
    }

    // Get user's site ID, default to null if not set
    const siteId = session.user.siteId || null;

    // If no site ID is set, return empty array as user must have a site
    if (!siteId) {
      return NextResponse.json([]);
    }

    const documents = await prisma.document.findMany({
      where: {
        siteId, // Filter by user's site
        ...(session.user.role === "ADMIN"
          ? {}
          : session.user.role === "APPROVER" && session.user.departmentId
            ? {
                departmentId: session.user.departmentId,
              }
            : {
                submitterId: session.user.id,
              }),
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
        department: true,
        type: true,
        departmentId: true,
        typeId: true,
        submitterId: true,
        siteId: true,
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

    // Block PENDING users from creating documents
    if (session.user.role === "PENDING") {
      return new NextResponse(
        "Access denied. Your account is pending approval. You cannot create documents until your account is approved.",
        { status: 403 }
      );
    }

    // Get user's site ID, default to null if not set
    const siteId = session.user.siteId;

    // If no site ID is set, return error as user must have a site
    if (!siteId) {
      return new NextResponse("User not associated with a site", {
        status: 400,
      });
    }

    const formData = await req.formData();
    const typeId = formData.get("typeId") as string;
    const description = formData.get("description") as string;
    const departmentId = formData.get("departmentId") as string | null;
    const file = formData.get("file") as File;

    if (!typeId || !description || !file) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Validate file upload
    const fileError = validateFileUpload(file);
    if (fileError) {
      return new NextResponse(fileError, { status: 400 });
    }

    const originalFilename = sanitizeFilename(file.name);

    // Convert file to Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Verify that the document type belongs to the user's site
    const documentType = await prisma.documentType.findFirst({
      where: {
        id: typeId,
        siteId,
      },
    });

    if (!documentType) {
      return new NextResponse("Invalid document type for this site", {
        status: 400,
      });
    }

    // Verify that the department belongs to the user's site if provided
    if (departmentId) {
      const department = await prisma.department.findFirst({
        where: {
          id: departmentId,
          siteId,
        },
      });

      if (!department) {
        return new NextResponse("Invalid department for this site", {
          status: 400,
        });
      }
    }

    const document = await prisma.document.create({
      data: {
        name: originalFilename,
        typeId,
        description,
        departmentId: departmentId || null,
        status: DocumentStatus.PENDING,
        content: buffer,
        mimeType: file.type,
        submitterId: session.user.id,
        siteId, // Set the site ID from the user's session
      },
      select: {
        id: true,
        name: true,
        description: true,
        status: true,
        createdAt: true,
        mimeType: true,
        department: true,
        type: true,
        siteId: true,
      },
    });

    return NextResponse.json(document);
  } catch (error) {
    console.error("[DOCUMENTS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
