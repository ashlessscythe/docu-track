import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET /api/admin/departments - Get all departments
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get user's site ID, default to null if not set
    const siteId = session.user.siteId || null;

    // If no site ID is set, return empty array as user must have a site
    if (!siteId) {
      return NextResponse.json([]);
    }

    const departments = await prisma.department.findMany({
      where: {
        siteId, // Filter by user's site
      },
      select: {
        id: true,
        name: true,
        description: true,
        siteId: true,
        site: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(departments);
  } catch (error) {
    console.error("Failed to fetch departments:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// POST /api/admin/departments - Create a new department
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { name, description, siteId } = body;

    // Get user's site ID if not provided
    const departmentSiteId = siteId || session.user.siteId;

    if (!departmentSiteId) {
      return new NextResponse("Site ID is required", { status: 400 });
    }

    if (!name) {
      return new NextResponse("Department name is required", { status: 400 });
    }

    // Verify the site exists
    const site = await prisma.site.findUnique({
      where: { id: departmentSiteId },
    });

    if (!site) {
      return new NextResponse("Site not found", { status: 404 });
    }

    const existingDepartment = await prisma.department.findFirst({
      where: {
        name,
        siteId: departmentSiteId,
      },
    });

    if (existingDepartment) {
      return new NextResponse(
        "Department with this name already exists in this site",
        {
          status: 400,
        }
      );
    }

    const department = await prisma.department.create({
      data: {
        name,
        description: description || "",
        siteId: departmentSiteId,
      },
      include: {
        site: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(department);
  } catch (error) {
    console.error("Failed to create department:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
