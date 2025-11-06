import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// PATCH /api/admin/users/[id]/update-site - Update a user's site
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated and is an admin
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { siteId } = await request.json();

    // Validate required fields
    if (!siteId) {
      return NextResponse.json(
        { error: "Site ID is required" },
        { status: 400 }
      );
    }

    // Check if site exists
    const site = await prisma.site.findUnique({
      where: { id: siteId },
    });

    if (!site) {
      return NextResponse.json({ error: "Site not found" }, { status: 404 });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: id },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update the user's site
    const updatedUser = await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        siteId,
        // If the user's department belongs to a different site, remove the department association
        departmentId: null, // Reset department when changing site
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        siteId: true,
        site: {
          select: {
            id: true,
            name: true,
          },
        },
        department: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user site:", error);
    return NextResponse.json(
      { error: "Failed to update user site" },
      { status: 500 }
    );
  }
}
