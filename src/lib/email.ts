import { Resend } from "resend";
import { WelcomeEmail } from "@/components/emails/WelcomeEmail";
import { PasswordResetEmail } from "@/components/emails/PasswordResetEmail";
import { AccountApprovalEmail } from "@/components/emails/AccountApprovalEmail";
import { DocumentActionEmail } from "@/components/emails/DocumentActionEmail";
import { User, Document, DocumentStatus, Comment } from "@prisma/client";
import { config } from "@/lib/config";

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = `${process.env.NEXT_PUBLIC_APP_NAME} <noreply@${process.env.EMAIL_FROM_DOMAIN}>`;
const appName = config.appName;

/**
 * Send a welcome email to a new user
 */
export async function sendWelcomeEmail(user: User) {
  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: user.email,
      subject: `Welcome to ${appName}!`,
      react: WelcomeEmail({ name: user.name, appName }),
    });

    if (error) {
      console.error("Error sending welcome email:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Exception sending welcome email:", error);
    return { success: false, error };
  }
}

import { NewUserAdminNotificationEmail } from "@/components/emails/NewUserAdminNotificationEmail";

/**
 * Send a notification email to all admins when a new user registers
 */
export async function sendAdminNewUserEmail(
  adminEmails: { email: string }[],
  newUser: User,
  appName: string
) {
  try {
    // Get base URL for dashboard link
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const dashboardUrl = `${baseUrl}/admin/users`;

    // Extract all admin email addresses
    const adminEmailAddresses = adminEmails.map((admin) => admin.email);

    // If no admin emails, log warning and return
    if (adminEmailAddresses.length === 0) {
      console.warn("No admin emails found to send notification");
      return { success: false, error: "No admin emails found" };
    }

    // Send a single email to all admins
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: adminEmailAddresses,
      subject: `New User Registration on ${appName}`,
      react: NewUserAdminNotificationEmail({
        userName: newUser.name,
        userEmail: newUser.email,
        appName,
        dashboardUrl,
      }),
    });

    if (error) {
      console.error("Error sending admin notification email:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Exception sending admin notification emails:", error);
    return { success: false, error };
  }
}

/**
 * Send a password reset email to a user
 */
export async function sendPasswordResetEmail(
  user: User,
  resetToken: string,
  baseUrl: string
) {
  try {
    // Create reset link
    const resetLink = `${baseUrl}/reset-password?token=${resetToken}&email=${encodeURIComponent(
      user.email
    )}`;

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: user.email,
      subject: `Reset Your ${appName} Password`,
      react: PasswordResetEmail({
        name: user.name,
        appName,
        resetLink,
      }),
    });

    if (error) {
      console.error("Error sending password reset email:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Exception sending password reset email:", error);
    return { success: false, error };
  }
}

/**
 * Send an account approval email to a user
 */
export async function sendAccountApprovalEmail(user: User) {
  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: user.email,
      subject: `Your ${appName} Account Has Been Approved`,
      react: AccountApprovalEmail({
        name: user.name,
        appName,
        role: user.role,
      }),
    });

    if (error) {
      console.error("Error sending account approval email:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Exception sending account approval email:", error);
    return { success: false, error };
  }
}

/**
 * Send a document action email to the document submitter
 */
export async function sendDocumentActionEmail(
  document: Document & {
    submitter: { name: string; email: string };
    type: { name: string };
    department?: { name: string } | null;
  },
  actionByUser: User,
  comments: (Comment & { user: { name: string } })[],
  baseUrl: string
) {
  try {
    // Determine action type based on document status
    const actionType = document.status as
      | "APPROVED"
      | "REJECTED"
      | "NEEDS_REVIEW";

    // Create dashboard URL for the document
    const dashboardUrl = `${baseUrl}/dashboard/documents/${document.id}`;

    // Format comments for the email
    const formattedComments = comments.map((comment) => ({
      content: comment.content,
      userName: comment.user.name,
    }));

    // Configure email subject based on action type
    let subject = "";
    switch (actionType) {
      case "APPROVED":
        subject = `Your Document "${document.name}" Has Been Approved`;
        break;
      case "REJECTED":
        subject = `Your Document "${document.name}" Has Been Rejected`;
        break;
      case "NEEDS_REVIEW":
        subject = `Your Document "${document.name}" Needs Review`;
        break;
      default:
        subject = `Update on Your Document "${document.name}"`;
    }

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: document.submitter.email,
      subject,
      react: DocumentActionEmail({
        recipientName: document.submitter.name,
        documentName: document.name,
        documentType: document.type.name,
        departmentName: document.department?.name,
        appName,
        actionType,
        actionByName: actionByUser.name,
        comments: formattedComments,
        dashboardUrl,
      }),
    });

    if (error) {
      console.error("Error sending document action email:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Exception sending document action email:", error);
    return { success: false, error };
  }
}
