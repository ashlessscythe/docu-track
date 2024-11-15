import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Fetch all data from the database
    const [users, departments, documentTypes, documents] = await Promise.all([
      prisma.user.findMany(),
      prisma.department.findMany(),
      prisma.documentType.findMany(),
      prisma.document.findMany(),
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
