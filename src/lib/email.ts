import { Resend } from "resend";
import { WelcomeEmail } from "@/components/emails/WelcomeEmail";
import { PasswordResetEmail } from "@/components/emails/PasswordResetEmail";
import { AccountApprovalEmail } from "@/components/emails/AccountApprovalEmail";
import { DocumentActionEmail } from "@/components/emails/DocumentActionEmail";
import { NewUserAdminNotificationEmail } from "@/components/emails/NewUserAdminNotificationEmail";
import { User, Document, DocumentStatus, Comment } from "@prisma/client";
import { config } from "@/lib/config";

// Lazy-init Resend to avoid build failures when API key is absent
function getResend(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

const fromEmail = `${process.env.NEXT_PUBLIC_APP_NAME} <notifications@${process.env.EMAIL_FROM_DOMAIN}>`;
const appName = config.appName;

// Helper function to generate plain text version of welcome email
function getWelcomeEmailText(
  name: string,
  appName: string,
  baseUrl?: string
): string {
  return `Welcome to ${appName}!

Hello ${name},

Thank you for joining ${appName}. We're excited to have you on board!

Your account is currently pending approval. You will receive an email notification once your account has been approved.

With ${appName}, you can:
- Easily manage document submissions
- Track approval processes
- Collaborate with your team

${baseUrl ? `Get started: ${baseUrl}/dashboard` : ""}

If you have any questions or need assistance, please don't hesitate to contact our support team.

© ${new Date().getFullYear()} ${appName}. All rights reserved.`;
}

// Helper function to generate plain text version of password reset email
function getPasswordResetEmailText(
  name: string,
  appName: string,
  resetLink: string
): string {
  return `Reset Your ${appName} Password

Hello ${name},

We received a request to reset your password for your ${appName} account. If you didn't make this request, you can safely ignore this email.

To reset your password, please click the link below:
${resetLink}

This link will expire in 1 hour for security reasons.

If you didn't request a password reset, please contact our support team immediately.

© ${new Date().getFullYear()} ${appName}. All rights reserved.`;
}

// Helper function to generate plain text version of account approval email
function getAccountApprovalEmailText(
  name: string,
  appName: string,
  role: string,
  baseUrl?: string
): string {
  const roleDisplay =
    role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
  return `Your ${appName} Account Has Been Approved

Hello ${name},

Great news! Your account on ${appName} has been approved.

Your account has been assigned the ${roleDisplay} role. You can now access all features available to your role.

${baseUrl ? `Go to Dashboard: ${baseUrl}/dashboard` : ""}

If you have any questions or need assistance, please don't hesitate to contact our support team.

© ${new Date().getFullYear()} ${appName}. All rights reserved.`;
}

// Helper function to generate plain text version of admin new user notification email
function getAdminNewUserEmailText(
  userName: string,
  userEmail: string,
  appName: string,
  dashboardUrl: string
): string {
  return `New User Registration on ${appName}

Hello Admin,

A new user has registered on ${appName} and is awaiting approval:

Name: ${userName}
Email: ${userEmail}

Please review this registration and take appropriate action.

Go to Admin Dashboard: ${dashboardUrl}

This is an automated message from ${appName}. Please do not reply to this email.`;
}

// Helper function to generate plain text version of document action email
function getDocumentActionEmailText(
  recipientName: string,
  documentName: string,
  documentType: string,
  departmentName: string | undefined,
  appName: string,
  actionType: "APPROVED" | "REJECTED" | "NEEDS_REVIEW",
  actionByName: string,
  comments: { content: string; userName: string }[],
  dashboardUrl: string
): string {
  const actionConfig = {
    APPROVED: {
      heading: "Document Approved!",
      message: `Great news! Your document "${documentName}" has been approved by ${actionByName}.`,
    },
    REJECTED: {
      heading: "Document Rejected",
      message: `Your document "${documentName}" has been rejected by ${actionByName}. Please review the comments below for more information.`,
    },
    NEEDS_REVIEW: {
      heading: "Document Needs Review",
      message: `Your document "${documentName}" requires additional review as requested by ${actionByName}. Please check the comments below for details.`,
    },
  }[actionType];

  let text = `${actionConfig.heading}

Hello ${recipientName},

${actionConfig.message}

Document Details:
Type: ${documentType}${departmentName ? `\nDepartment: ${departmentName}` : ""}
`;

  if (comments.length > 0) {
    text += "\nComments:\n";
    comments.forEach((comment) => {
      text += `${comment.userName}: ${comment.content}\n`;
    });
  }

  text += `\nView Document: ${dashboardUrl}

If you have any questions or need assistance, please don't hesitate to contact our support team.

© ${new Date().getFullYear()} ${appName}. All rights reserved.`;

  return text;
}

/**
 * Send a welcome email to a new user
 */
export async function sendWelcomeEmail(user: User) {
  try {
    const resend = getResend();
    if (!resend) {
      console.warn("RESEND_API_KEY not configured, skipping welcome email");
      return { success: false, error: "Email not configured" };
    }
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: user.email,
      subject: `Welcome to ${appName}!`,
      react: WelcomeEmail({ name: user.name, appName }),
      text: getWelcomeEmailText(user.name, appName, baseUrl),
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
    const resend = getResend();
    if (!resend) {
      return { success: false, error: "Email not configured" };
    }
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
      text: getAdminNewUserEmailText(
        newUser.name,
        newUser.email,
        appName,
        dashboardUrl
      ),
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

    const resend = getResend();
    if (!resend) {
      return { success: false, error: "Email not configured" };
    }
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: user.email,
      subject: `Reset Your ${appName} Password`,
      react: PasswordResetEmail({
        name: user.name,
        appName,
        resetLink,
      }),
      text: getPasswordResetEmailText(user.name, appName, resetLink),
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
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const resend = getResend();
    if (!resend) {
      return { success: false, error: "Email not configured" };
    }
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: user.email,
      subject: `Your ${appName} Account Has Been Approved`,
      react: AccountApprovalEmail({
        name: user.name,
        appName,
        role: user.role,
      }),
      text: getAccountApprovalEmailText(user.name, appName, user.role, baseUrl),
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

    const resend = getResend();
    if (!resend) {
      return { success: false, error: "Email not configured" };
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
      text: getDocumentActionEmailText(
        document.submitter.name,
        document.name,
        document.type.name,
        document.department?.name,
        appName,
        actionType,
        actionByUser.name,
        formattedComments,
        dashboardUrl
      ),
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
