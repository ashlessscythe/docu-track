import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendAccountApprovalEmail,
  sendAdminNewUserEmail,
  sendDocumentActionEmail,
} from "@/lib/email";
import { randomBytes } from "crypto";
import { User, UserRole } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated and is an admin
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      template,
      recipientEmail,
      recipientName,
      role,
      resetLink,
      userName,
      userEmail,
      dashboardUrl,
      documentName,
      documentType,
      departmentName,
      actionType,
      actionByName,
      comments,
    } = body;

    if (!recipientEmail) {
      return NextResponse.json(
        { error: "Recipient email is required" },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

    switch (template) {
      case "welcome": {
        // Use placeholder if not provided
        const finalRecipientName = recipientName || "Test User";

        // Create a mock user object with form values
        const mockUser: User = {
          id: "test-user-id",
          name: finalRecipientName,
          email: recipientEmail,
          role: UserRole.SUBMITTER,
          password: "",
          createdAt: new Date(),
          updatedAt: new Date(),
          siteId: null,
          departmentId: null,
          resetToken: null,
          resetTokenExpiry: null,
        };

        const result = await sendWelcomeEmail(mockUser);
        if (!result.success) {
          return NextResponse.json(
            { error: result.error || "Failed to send welcome email" },
            { status: 500 }
          );
        }

        return NextResponse.json({
          success: true,
          message: "Welcome email sent successfully",
          data: result.data,
        });
      }

      case "password-reset": {
        // Use placeholder if not provided
        const finalRecipientName = recipientName || "Test User";

        // Generate a test reset token if not provided
        const testToken = resetLink
          ? new URL(resetLink).searchParams.get("token") ||
            randomBytes(32).toString("hex")
          : randomBytes(32).toString("hex");

        const finalResetLink =
          resetLink ||
          `${baseUrl}/reset-password?token=${testToken}&email=${encodeURIComponent(
            recipientEmail
          )}`;

        // Create a mock user object
        const mockUser: User = {
          id: "test-user-id",
          name: finalRecipientName,
          email: recipientEmail,
          role: UserRole.SUBMITTER,
          password: "",
          createdAt: new Date(),
          updatedAt: new Date(),
          siteId: null,
          departmentId: null,
          resetToken: null,
          resetTokenExpiry: null,
        };

        const result = await sendPasswordResetEmail(
          mockUser,
          testToken,
          baseUrl
        );
        if (!result.success) {
          return NextResponse.json(
            { error: result.error || "Failed to send password reset email" },
            { status: 500 }
          );
        }

        return NextResponse.json({
          success: true,
          message: "Password reset email sent successfully",
          data: result.data,
        });
      }

      case "account-approval": {
        // Use placeholders if not provided
        const finalRecipientName = recipientName || "Test User";
        const finalRole = role || UserRole.SUBMITTER;

        // Create a mock user object
        const mockUser: User = {
          id: "test-user-id",
          name: finalRecipientName,
          email: recipientEmail,
          role: finalRole as UserRole,
          password: "",
          createdAt: new Date(),
          updatedAt: new Date(),
          siteId: null,
          departmentId: null,
          resetToken: null,
          resetTokenExpiry: null,
        };

        const result = await sendAccountApprovalEmail(mockUser);
        if (!result.success) {
          return NextResponse.json(
            {
              error: result.error || "Failed to send account approval email",
            },
            { status: 500 }
          );
        }

        return NextResponse.json({
          success: true,
          message: "Account approval email sent successfully",
          data: result.data,
        });
      }

      case "admin-new-user": {
        // Use placeholders if not provided
        const finalUserName = userName || "New Test User";
        const finalUserEmail = userEmail || "newuser@example.com";

        // Create mock user objects
        const mockNewUser: User = {
          id: "test-new-user-id",
          name: finalUserName,
          email: finalUserEmail,
          role: UserRole.SUBMITTER,
          password: "",
          createdAt: new Date(),
          updatedAt: new Date(),
          siteId: null,
          departmentId: null,
          resetToken: null,
          resetTokenExpiry: null,
        };

        const adminEmails = [{ email: recipientEmail }];
        const appName = process.env.NEXT_PUBLIC_APP_NAME || "DocuTrack";

        const result = await sendAdminNewUserEmail(
          adminEmails,
          mockNewUser,
          appName
        );
        if (!result.success) {
          return NextResponse.json(
            {
              error:
                result.error || "Failed to send admin new user notification",
            },
            { status: 500 }
          );
        }

        return NextResponse.json({
          success: true,
          message: "Admin new user notification sent successfully",
          data: result.data,
        });
      }

      case "document-action": {
        // Use placeholders if not provided
        const finalRecipientName = recipientName || "Test User";
        const finalDocumentName = documentName || "Test Document";
        const finalDocumentType = documentType || "Test Document Type";
        const finalActionType = actionType || "APPROVED";
        const finalActionByName = actionByName || "Admin User";

        // Parse comments if provided
        const formattedComments = comments
          ? comments
              .split("\n")
              .filter((line: string) => line.trim())
              .map((line: string) => ({
                content: line.trim(),
                userName: finalActionByName,
              }))
          : [];

        // Create mock document and user objects
        const mockDocument = {
          id: "test-doc-id",
          name: finalDocumentName,
          description: "Test document",
          status: finalActionType as "APPROVED" | "REJECTED" | "NEEDS_REVIEW",
          fileUrl: "",
          createdAt: new Date(),
          updatedAt: new Date(),
          submitterId: "test-submitter-id",
          approverId: null,
          typeId: "test-type-id",
          departmentId: null,
          siteId: null,
          submitter: {
            name: finalRecipientName,
            email: recipientEmail,
          },
          type: {
            name: finalDocumentType,
          },
          department: departmentName
            ? {
                name: departmentName,
              }
            : null,
        };

        const mockActionByUser: User = {
          id: "test-action-user-id",
          name: finalActionByName,
          email: "actionby@example.com",
          role: UserRole.ADMIN,
          password: "",
          createdAt: new Date(),
          updatedAt: new Date(),
          siteId: null,
          departmentId: null,
          resetToken: null,
          resetTokenExpiry: null,
        };

        const finalDashboardUrl =
          dashboardUrl || `${baseUrl}/dashboard/documents/${mockDocument.id}`;

        const result = await sendDocumentActionEmail(
          mockDocument as any,
          mockActionByUser,
          formattedComments.map((c: any) => ({
            id: "test-comment-id",
            content: c.content,
            createdAt: new Date(),
            updatedAt: new Date(),
            documentId: mockDocument.id,
            userId: mockActionByUser.id,
            user: {
              name: c.userName,
            },
          })) as any,
          baseUrl
        );

        if (!result.success) {
          return NextResponse.json(
            {
              error: result.error || "Failed to send document action email",
            },
            { status: 500 }
          );
        }

        return NextResponse.json({
          success: true,
          message: "Document action email sent successfully",
          data: result.data,
        });
      }

      default:
        return NextResponse.json(
          { error: "Invalid email template" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Error sending test email:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to send test email",
      },
      { status: 500 }
    );
  }
}
