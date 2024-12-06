import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

// GET /api/templates/[id]/download - Download a specific template
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user with department
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { department: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get template
    const template = await prisma.template.findUnique({
      where: { id: params.id },
    });

    if (!template) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }

    // Check if user has access to this template
    // Users can access global templates (departmentId = null) or templates from their department
    if (template.departmentId && template.departmentId !== user.departmentId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the original filename from the upload
    const originalFilename = template.name;

    // Return the file with proper headers for download
    return new NextResponse(template.content, {
      headers: {
        "Content-Type": template.mimeType,
        "Content-Disposition": `attachment; filename="${originalFilename}"`,
      },
    });
  } catch (error) {
    console.error("Error downloading template:", error);
    return NextResponse.json(
      { error: "Failed to download template" },
      { status: 500 }
    );
  }
}
