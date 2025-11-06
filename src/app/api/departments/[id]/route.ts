import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const department = await prisma.department.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        name: true,
      },
    });

    if (!department) {
      return new NextResponse("Department not found", { status: 404 });
    }

    return NextResponse.json(department);
  } catch (error) {
    console.error("Error fetching department:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
