import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get user's site ID, default to null if not set
    const siteId = session.user.siteId || null;

    // If no site ID is set, return empty array as user must have a site
    if (!siteId) {
      return NextResponse.json([]);
    }

    // Only admins can see all feedback, others can only see their own
    const feedback = await prisma.feedback.findMany({
      where: {
        siteId, // Filter by user's site
        ...(session.user.role === "ADMIN" ? {} : { userId: session.user.id }),
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(feedback);
  } catch (error) {
    console.error("[FEEDBACK_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
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

    const body = await req.json();
    const { content } = body;

    if (!content) {
      return new NextResponse("Content is required", { status: 400 });
    }

    const feedback = await prisma.feedback.create({
      data: {
        content,
        userId: session.user.id,
        siteId, // Set the site ID from the user's session
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(feedback);
  } catch (error) {
    console.error("[FEEDBACK_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
