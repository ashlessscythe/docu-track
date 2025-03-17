import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET /api/admin/sites - Get all sites
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated and is an admin
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sites = await prisma.site.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(sites);
  } catch (error) {
    console.error("Error fetching sites:", error);
    return NextResponse.json(
      { error: "Failed to fetch sites" },
      { status: 500 }
    );
  }
}

// POST /api/admin/sites - Create a new site
export async function POST(request: NextRequest) {
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

    // Check if site with the same name already exists
    const existingSite = await prisma.site.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive", // Case insensitive comparison
        },
      },
    });

    if (existingSite) {
      return NextResponse.json(
        { error: "A site with this name already exists" },
        { status: 400 }
      );
    }

    // Create the new site
    const newSite = await prisma.site.create({
      data: {
        name,
        description,
      },
    });

    return NextResponse.json(newSite, { status: 201 });
  } catch (error) {
    console.error("Error creating site:", error);
    return NextResponse.json(
      { error: "Failed to create site" },
      { status: 500 }
    );
  }
}
