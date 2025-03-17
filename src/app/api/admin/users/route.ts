import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

// GET /api/admin/users - Get all users
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get user's site ID, default to null if not set
    const siteId = session.user.siteId || null;

    // If no site ID is set, return empty array as user must have a site
    if (!siteId) {
      return NextResponse.json([]);
    }

    const users = await prisma.user.findMany({
      where: {
        siteId, // Filter by user's site
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        siteId: true,
        site: true,
        department: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// POST /api/admin/users - Create a new user
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get user's site ID, default to null if not set
    const siteId = session.user.siteId;

    // If no site ID is set, return error as user must have a site
    if (!siteId) {
      return new NextResponse("User not associated with a site", {
        status: 400,
      });
    }

    const body = await request.json();
    const { name, email, password, role, departmentId } = body;

    if (!name || !email || !password || !role) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return new NextResponse("User with this email already exists", {
        status: 400,
      });
    }

    // Verify that the department belongs to the user's site if provided
    if (departmentId) {
      const department = await prisma.department.findFirst({
        where: {
          id: departmentId,
          siteId,
        },
      });

      if (!department) {
        return new NextResponse("Invalid department for this site", {
          status: 400,
        });
      }
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        departmentId: departmentId || null,
        siteId, // Set the site ID from the admin's session
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        siteId: true,
        department: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Failed to create user:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
