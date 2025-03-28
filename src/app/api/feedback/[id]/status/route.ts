import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { FeedbackStatus } from "@prisma/client";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Only admins can update feedback status
    if (session.user.role !== "ADMIN") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const feedbackId = params.id;
    if (!feedbackId) {
      return new NextResponse("Feedback ID is required", { status: 400 });
    }

    const body = await req.json();
    const { status } = body;

    if (!status || !Object.values(FeedbackStatus).includes(status)) {
      return new NextResponse("Valid status is required", { status: 400 });
    }

    // Get user's site ID
    const siteId = session.user.siteId;
    if (!siteId) {
      return new NextResponse("User not associated with a site", {
        status: 400,
      });
    }

    // Check if feedback exists and belongs to the user's site
    const existingFeedback = await prisma.feedback.findFirst({
      where: {
        id: feedbackId,
        siteId,
      },
    });

    if (!existingFeedback) {
      return new NextResponse("Feedback not found", { status: 404 });
    }

    // Update feedback status
    const updatedFeedback = await prisma.feedback.update({
      where: {
        id: feedbackId,
      },
      data: {
        status: status as FeedbackStatus,
      },
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
    });

    return NextResponse.json(updatedFeedback);
  } catch (error) {
    console.error("[FEEDBACK_STATUS_UPDATE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
