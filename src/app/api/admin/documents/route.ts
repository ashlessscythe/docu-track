import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, requireSiteAccess } from "@/lib/api-auth";
import { DocumentStatus, Prisma } from "@prisma/client";

export async function GET(request: Request) {
  const session = await requireAdmin();
  if (session instanceof Response) return session;

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as DocumentStatus | null;
    const departmentId = searchParams.get("departmentId");
    const typeId = searchParams.get("typeId");
    const search = searchParams.get("search");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = (searchParams.get("sortOrder") || "desc") as
      | "asc"
      | "desc";

    const siteId = session.user.siteId;
    if (!siteId) {
      return NextResponse.json(
        { error: "Admin must be assigned to a site" },
        { status: 403 }
      );
    }

    const where: Prisma.DocumentWhereInput = {
      siteId,
      ...(status && { status }),
      ...(departmentId && { departmentId }),
      ...(typeId && { typeId }),
      ...(search && {
        OR: [
          {
            name: { contains: search, mode: "insensitive" as Prisma.QueryMode },
          },
          {
            description: {
              contains: search,
              mode: "insensitive" as Prisma.QueryMode,
            },
          },
        ],
      }),
    };

    const orderBy: Prisma.DocumentOrderByWithRelationInput = {
      [sortBy]: sortOrder,
    };

    const documents = await prisma.document.findMany({
      where,
      include: {
        type: true,
        department: true,
        submitter: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        approver: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy,
    });

    return NextResponse.json(documents);
  } catch (error) {
    console.error("Error fetching documents:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
