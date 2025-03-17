import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

// Default site ID (matches the one created in the migration)
const DEFAULT_SITE_ID = "default-site-id";

// GET /api/admin/templates - List all templates
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const templates = await prisma.template.findMany({
      include: {
        department: true,
        type: true,
      },
    });

    // Don't send the file content in the list view
    const templatesWithoutContent = templates.map(
      ({ content, ...rest }) => rest
    );

    return NextResponse.json(templatesWithoutContent);
  } catch (error) {
    console.error("Error fetching templates:", error);
    return NextResponse.json(
      { error: "Failed to fetch templates" },
      { status: 500 }
    );
  }
}

// POST /api/admin/templates - Create a new template
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const description = formData.get("description") as string;
    const departmentId = formData.get("departmentId") as string | null;
    const typeId = formData.get("typeId") as string;
    const siteId = (formData.get("siteId") as string) || DEFAULT_SITE_ID;

    if (!file || !description || !typeId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Use the original filename from the uploaded file
    const originalFilename = file.name;

    // Read file content as ArrayBuffer and convert to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Create template in database
    // Only set departmentId if it's provided and not empty
    const template = await prisma.template.create({
      data: {
        name: originalFilename,
        description,
        content: buffer,
        mimeType: file.type,
        departmentId: departmentId || null, // Keep null if not provided or empty
        typeId,
        siteId,
      },
      include: {
        department: true,
        type: true,
      },
    });

    // Don't send the file content in the response
    const { content, ...templateWithoutContent } = template;

    return NextResponse.json(templateWithoutContent, { status: 201 });
  } catch (error) {
    console.error("Error creating template:", error);
    return NextResponse.json(
      { error: "Failed to create template" },
      { status: 500 }
    );
  }
}
