import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession, requireSiteAccess } from "@/lib/api-auth";
import { sanitizeFilename } from "@/lib/schemas";

export const dynamic = "force-dynamic";

// GET /api/templates/[id]/download - Download a specific template
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
try {
    const session = await requireSession();
    if (session instanceof Response) return session;

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { department: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const template = await prisma.template.findUnique({
      where: { id: id },
    });

    if (!template) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }

    const siteError = requireSiteAccess(session, template.siteId);
    if (siteError) return siteError;

    if (template.departmentId && template.departmentId !== user.departmentId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const originalFilename = sanitizeFilename(template.name);

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
