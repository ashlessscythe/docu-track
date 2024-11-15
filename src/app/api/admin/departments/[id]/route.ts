import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// PATCH /api/admin/departments/[id] - Update department
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    // Check if another department already has this name
    const existingDepartment = await prisma.department.findFirst({
      where: {
        name,
        NOT: {
          id: params.id,
        },
      },
    });

    if (existingDepartment) {
      return new NextResponse("Department with this name already exists", {
        status: 400,
      });
    }

    const department = await prisma.department.update({
      where: { id: params.id },
      data: {
        name,
        description,
      },
    });

    return NextResponse.json(department);
  } catch (error) {
    console.error("Failed to update department:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// DELETE /api/admin/departments/[id] - Delete department
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if there are any users in this department
    const usersInDepartment = await prisma.user.findFirst({
      where: { departmentId: params.id },
    });

    if (usersInDepartment) {
      return new NextResponse(
        "Cannot delete department with assigned users. Please reassign users first.",
        { status: 400 }
      );
    }

    // Check if there are any documents in this department
    const documentsInDepartment = await prisma.document.findFirst({
      where: { departmentId: params.id },
    });

    if (documentsInDepartment) {
      return new NextResponse(
        "Cannot delete department with associated documents. Please reassign or delete the documents first.",
        { status: 400 }
      );
    }

    await prisma.department.delete({
      where: { id: params.id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Failed to delete department:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
