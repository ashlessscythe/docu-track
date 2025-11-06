import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET /api/admin/sites/[id] - Get a specific site
export async function GET(
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

    const site = await prisma.site.findUnique({
      where: {
        id: id,
      },
    });

    if (!site) {
      return NextResponse.json({ error: "Site not found" }, { status: 404 });
    }

    return NextResponse.json(site);
  } catch (error) {
    console.error("Error fetching site:", error);
    return NextResponse.json(
      { error: "Failed to fetch site" },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/sites/[id] - Update a site
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

    const { name, description } = await request.json();

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: "Site name is required" },
        { status: 400 }
      );
    }

    // Check if site with the same name already exists (excluding current site)
    const existingSite = await prisma.site.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive", // Case insensitive comparison
        },
        id: {
          not: id,
        },
      },
    });

    if (existingSite) {
      return NextResponse.json(
        { error: "A site with this name already exists" },
        { status: 400 }
      );
    }

    // Update the site
    const updatedSite = await prisma.site.update({
      where: {
        id: id,
      },
      data: {
        name,
        description,
      },
    });

    return NextResponse.json(updatedSite);
  } catch (error) {
    console.error("Error updating site:", error);
    return NextResponse.json(
      { error: "Failed to update site" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/sites/[id] - Delete a site
export async function DELETE(
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

    // Check if this is the default site
    const site = await prisma.site.findUnique({
      where: {
        id: id,
      },
    });

    if (!site) {
      return NextResponse.json({ error: "Site not found" }, { status: 404 });
    }

    // Check if there are any associated records
    const associatedRecords = await Promise.all([
      prisma.user.count({ where: { siteId: id } }),
      prisma.department.count({ where: { siteId: id } }),
      prisma.documentType.count({ where: { siteId: id } }),
      prisma.document.count({ where: { siteId: id } }),
      prisma.template.count({ where: { siteId: id } }),
      prisma.feedback.count({ where: { siteId: id } }),
    ]);

    const totalAssociatedRecords = associatedRecords.reduce(
      (sum, count) => sum + count,
      0
    );

    if (totalAssociatedRecords > 0) {
      return NextResponse.json(
        {
          error:
            "Cannot delete site with associated records. Please reassign or delete the associated records first.",
        },
        { status: 400 }
      );
    }

    // Delete the site
    await prisma.site.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json({ message: "Site deleted successfully" });
  } catch (error) {
    console.error("Error deleting site:", error);
    return NextResponse.json(
      { error: "Failed to delete site" },
      { status: 500 }
    );
  }
}
