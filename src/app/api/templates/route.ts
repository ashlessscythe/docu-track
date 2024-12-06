import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

// GET /api/templates - List available templates for the user
export async function GET() {
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

    // Get templates based on user's role and department
    const templates = await prisma.template.findMany({
      where: {
        OR: [
          { departmentId: null }, // Global templates
          { departmentId: user.departmentId }, // Department-specific templates
        ],
      },
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
