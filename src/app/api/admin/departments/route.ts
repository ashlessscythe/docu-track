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

    const departments = await prisma.department.findMany({
      select: {
        id: true,
        name: true,
        description: true,
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
    const { name, description } = body;

    if (!name) {
      return new NextResponse("Department name is required", { status: 400 });
    }

    const existingDepartment = await prisma.department.findFirst({
      where: { name },
    });

    if (existingDepartment) {
      return new NextResponse("Department with this name already exists", {
        status: 400,
      });
    }

    const department = await prisma.department.create({
      data: {
        name,
        description: description || "",
      },
    });

    return NextResponse.json(department);
  } catch (error) {
    console.error("Failed to create department:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
