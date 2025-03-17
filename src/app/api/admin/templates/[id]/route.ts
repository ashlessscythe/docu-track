import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Template } from "@/types";

// Default site ID (matches the one created in the migration)
const DEFAULT_SITE_ID = "default-site-id";

// GET /api/admin/templates/[id] - Get a specific template
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const template = await prisma.template.findUnique({
      where: { id: params.id },
      include: {
        department: true,
        type: true,
      },
    });

    if (!template) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(template);
  } catch (error) {
    console.error("Error fetching template:", error);
    return NextResponse.json(
      { error: "Failed to fetch template" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/templates/[id] - Delete a template
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.template.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Template deleted successfully" });
  } catch (error) {
    console.error("Error deleting template:", error);
    return NextResponse.json(
      { error: "Failed to delete template" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/templates/[id] - Update a template
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const departmentId = formData.get("departmentId") as string;
    const typeId = formData.get("typeId") as string;
    const siteId = (formData.get("siteId") as string) || DEFAULT_SITE_ID;

    if (!name || !description || !typeId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const updateData = {
      name,
      description,
      departmentId: departmentId || null,
      typeId,
      siteId,
      ...(file && {
        content: Buffer.from(await file.arrayBuffer()),
        mimeType: file.type,
      }),
    };

    const templateData = await prisma.template.update({
      where: { id: params.id },
      data: updateData,
      include: {
        department: true,
        type: true,
      },
    });

    // Convert Uint8Array to Buffer for type compatibility
    const template = {
      ...templateData,
      content: Buffer.from(templateData.content),
    } as Template;

    // Don't send the file content in the response
    const { content, ...templateWithoutContent } = template;

    return NextResponse.json(templateWithoutContent);
  } catch (error) {
    console.error("Error updating template:", error);
    return NextResponse.json(
      { error: "Failed to update template" },
      { status: 500 }
    );
  }
}
