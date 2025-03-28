import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { FeedbackStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get user's site ID, default to null if not set
    const siteId = session.user.siteId || null;

    // If no site ID is set, return empty array as user must have a site
    if (!siteId) {
      return NextResponse.json({
        feedback: [],
        pagination: {
          total: 0,
          page: 1,
          limit: 10,
          pages: 0,
        },
      });
    }

    // Parse query parameters
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "10", 10);
    const statusFilter = url.searchParams.get(
      "status"
    ) as FeedbackStatus | null;

    // Validate pagination parameters
    const validPage = page > 0 ? page : 1;
    const validLimit = limit > 0 && limit <= 100 ? limit : 10;
    const skip = (validPage - 1) * validLimit;

    // Build where clause
    const where = {
      siteId, // Filter by user's site
      ...(session.user.role === "ADMIN" ? {} : { userId: session.user.id }), // Only admins can see all feedback
      ...(statusFilter ? { status: statusFilter } : {}), // Filter by status if provided
    };

    // Get total count for pagination
    const total = await prisma.feedback.count({ where });

    // Calculate total pages
    const pages = Math.ceil(total / validLimit);

    // Get feedback with pagination
    const feedback = await prisma.feedback.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: validLimit,
    });

    return NextResponse.json({
      feedback,
      pagination: {
        total,
        page: validPage,
        limit: validLimit,
        pages,
      },
    });
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
