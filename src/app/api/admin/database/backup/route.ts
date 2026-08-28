import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const session = await requireAdmin();
    if (session instanceof Response) return session;

    const siteId = session.user.siteId;

    // Fetch site-scoped data, excluding password hashes from users
    const [users, departments, documentTypes, documents] = await Promise.all([
      prisma.user.findMany({
        where: siteId ? { siteId } : undefined,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          departmentId: true,
          siteId: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.department.findMany({
        where: siteId ? { siteId } : undefined,
      }),
      prisma.documentType.findMany({
        where: siteId ? { siteId } : undefined,
      }),
      prisma.document.findMany({
        where: siteId ? { siteId } : undefined,
      }),
    ]);

    const backup = {
      timestamp: new Date().toISOString(),
      data: {
        users,
        departments,
        documentTypes,
        documents,
      },
    };

    // Return the backup data as a JSON file
    return new NextResponse(JSON.stringify(backup, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename=backup-${backup.timestamp}.json`,
      },
    });
  } catch (error) {
    console.error("Failed to create backup:", error);
    return new NextResponse("Failed to create backup", { status: 500 });
  }
}
