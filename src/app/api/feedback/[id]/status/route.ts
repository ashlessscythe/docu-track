import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions, sessionHasError } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { FeedbackStatus } from "@prisma/client";

// PATCH /api/feedback/[id]/status - Update feedback status
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated and is an admin
    if (!session || (await sessionHasError(session))) {
      return NextResponse.json(
        { error: "You must be signed in to update feedback" },
        { status: 401 }
      );
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only administrators can update feedback status" },
        { status: 403 }
      );
    }

    const { id } = params;
    const { status } = await req.json();

    // Validate status
    if (!status || !Object.values(FeedbackStatus).includes(status)) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 }
      );
    }

    // Check if feedback exists
    const existingFeedback = await prisma.feedback.findUnique({
      where: { id },
    });

    if (!existingFeedback) {
      return NextResponse.json(
        { error: "Feedback not found" },
        { status: 404 }
      );
    }

    // Update feedback status
    const updatedFeedback = await prisma.feedback.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({
      message: "Feedback status updated successfully",
      feedback: updatedFeedback,
    });
  } catch (error) {
    console.error("Error updating feedback status:", error);
    return NextResponse.json(
      { error: "Failed to update feedback status" },
      { status: 500 }
    );
  }
}
