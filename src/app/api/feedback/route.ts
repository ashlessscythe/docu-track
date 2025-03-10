import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions, sessionHasError } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST /api/feedback - Create a new feedback entry
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated
    if (!session || (await sessionHasError(session))) {
      return NextResponse.json(
        { error: "You must be signed in to submit feedback" },
        { status: 401 }
      );
    }

    const { content } = await req.json();

    // Validate input
    if (!content || typeof content !== "string" || content.trim() === "") {
      return NextResponse.json(
        { error: "Feedback content is required" },
        { status: 400 }
      );
    }

    // Create feedback entry
    const feedback = await prisma.feedback.create({
      data: {
        content,
        userId: session.user.id,
        status: "PENDING",
      },
    });

    return NextResponse.json(
      { message: "Feedback submitted successfully", feedback },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting feedback:", error);
    return NextResponse.json(
      { error: "Failed to submit feedback" },
      { status: 500 }
    );
  }
}

// GET /api/feedback - Get all feedback (admin only)
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated and is an admin
    if (!session || (await sessionHasError(session))) {
      return NextResponse.json(
        { error: "You must be signed in to access feedback" },
        { status: 401 }
      );
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only administrators can access feedback" },
        { status: 403 }
      );
    }

    // Get query parameters
    const url = new URL(req.url);
    const status = url.searchParams.get("status");
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    if (status && ["PENDING", "REVIEWED", "RESOLVED"].includes(status)) {
      where.status = status;
    }

    // Get feedback with pagination
    const [feedback, total] = await Promise.all([
      prisma.feedback.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              departmentId: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.feedback.count({ where }),
    ]);

    return NextResponse.json({
      feedback,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error retrieving feedback:", error);
    return NextResponse.json(
      { error: "Failed to retrieve feedback" },
      { status: 500 }
    );
  }
}
