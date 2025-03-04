import { Resend } from "resend";
import { WelcomeEmail } from "@/components/emails/WelcomeEmail";
import { PasswordResetEmail } from "@/components/emails/PasswordResetEmail";
import { User } from "@prisma/client";

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = `${process.env.NEXT_PUBLIC_APP_NAME} <noreply@${process.env.EMAIL_FROM_DOMAIN}>`;
const appName = process.env.NEXT_PUBLIC_APP_NAME || "DokuTrako";

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
