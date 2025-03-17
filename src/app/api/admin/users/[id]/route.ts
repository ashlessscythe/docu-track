import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { sendAccountApprovalEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

// PATCH /api/admin/users/[id] - Update user
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
    const { role, departmentId, siteId, password, name, email } = body;

    // Get the current user to check if role is changing from PENDING
    const currentUser = await prisma.user.findUnique({
      where: { id: params.id },
      select: { role: true, email: true, siteId: true },
    });

    if (!currentUser) {
      return new NextResponse("User not found", { status: 404 });
    }

    const isApproval =
      currentUser?.role === "PENDING" && role && role !== "PENDING";

    // Check if email is being changed and if it's already in use
    if (email && email !== currentUser.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return new NextResponse("Email already in use", { status: 400 });
      }
    }

    // If site is changing, verify the new site exists
    if (siteId && siteId !== currentUser.siteId) {
      const site = await prisma.site.findUnique({
        where: { id: siteId },
      });

      if (!site) {
        return new NextResponse("Site not found", { status: 404 });
      }
    }

    // If department is changing, verify it belongs to the user's site
    if (departmentId) {
      const userSiteId = siteId || currentUser.siteId;

      if (userSiteId) {
        const department = await prisma.department.findFirst({
          where: {
            id: departmentId,
            siteId: userSiteId,
          },
        });

        if (!department) {
          return new NextResponse(
            "Department not found in the specified site",
            {
              status: 400,
            }
          );
        }
      }
    }

    // Prepare update data
    const updateData: any = {};
    if (role !== undefined) updateData.role = role;
    if (departmentId !== undefined) updateData.departmentId = departmentId;
    if (siteId !== undefined) updateData.siteId = siteId;
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 12);
      updateData.password = hashedPassword;
    }

    const user = await prisma.user.update({
      where: { id: params.id },
      data: updateData,
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

    // Send approval email if user is being approved
    if (isApproval) {
      // Fetch the complete user object for the email
      const fullUser = await prisma.user.findUnique({
        where: { id: user.id },
      });

      if (fullUser) {
        await sendAccountApprovalEmail(fullUser);
      }
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Failed to update user:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// DELETE /api/admin/users/[id] - Delete user
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await prisma.user.delete({
      where: { id: params.id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Failed to delete user:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
