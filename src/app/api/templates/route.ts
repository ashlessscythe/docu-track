import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Maximum file size: 1.5MB in bytes
const MAX_FILE_SIZE = 1.5 * 1024 * 1024;

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Block PENDING users from accessing templates
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

    const templates = await prisma.template.findMany({
      where: {
        siteId, // Filter by user's site
        ...(["ADMIN", "SUBMITTER", "APPROVER"].includes(session.user.role)
          ? {}
          : session.user.departmentId
            ? {
                departmentId: session.user.departmentId,
              }
            : {}),
      },
      select: {
        id: true,
        name: true,
        description: true,
        mimeType: true,
        createdAt: true,
        updatedAt: true,
        department: true,
        type: true,
        departmentId: true,
        typeId: true,
        siteId: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(templates);
  } catch (error) {
    console.error("[TEMPLATES_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
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
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const typeId = formData.get("typeId") as string;
    const departmentId = formData.get("departmentId") as string | null;
    const file = formData.get("file") as File;

    if (!name || !description || !typeId || !file) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return new NextResponse("File size exceeds 1.5MB limit", { status: 400 });
    }

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

    // Convert file to Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    const template = await prisma.template.create({
      data: {
        name,
        description,
        typeId,
        departmentId,
        content: buffer,
        mimeType: file.type,
        siteId, // Set the site ID from the user's session
      },
      select: {
        id: true,
        name: true,
        description: true,
        mimeType: true,
        createdAt: true,
        department: true,
        type: true,
        siteId: true,
      },
    });

    return NextResponse.json(template);
  } catch (error) {
    console.error("[TEMPLATES_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
