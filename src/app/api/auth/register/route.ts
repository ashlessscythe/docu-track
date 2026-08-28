import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { UserRole } from "@prisma/client";
import { z } from "zod";
import { sendAdminNewUserEmail, sendWelcomeEmail } from "@/lib/email";
import { config } from "@/lib/config";

// Validation schema with stronger password requirements
const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  name: z.string().min(1, "Name is required"),
  turnstileToken: z.string().optional(),
});

/**
 * Verify Turnstile token with Cloudflare
 */
async function verifyTurnstileToken(token: string): Promise<boolean> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  
  // If Turnstile is not configured, skip verification
  if (!secretKey) {
    return true;
  }

  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          secret: secretKey,
          response: token,
        }),
      }
    );

    const data = await response.json();
    return data.success === true;
  } catch (error) {
    console.error("Turnstile verification error:", error);
    return false;
  }
}

export async function POST(req: Request) {
  try {
    // Parse request body
    const body = await req.json();

    // Validate input
    const result = registerSchema.safeParse(body);
    if (!result.success) {
      console.error("Validation error:", result.error);
      
      // Extract field-specific errors
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as string;
        if (field && !fieldErrors[field]) {
          fieldErrors[field] = err.message;
        }
      });

      // Return specific error messages
      return NextResponse.json(
        { 
          error: "Validation failed",
          fieldErrors,
          // Also include a general message for the first error
          message: result.error.errors[0]?.message || "Please check your input"
        },
        { status: 400 }
      );
    }

    const { email, password, name, turnstileToken } = result.data;

    // Verify Turnstile token if provided
    if (process.env.TURNSTILE_SECRET_KEY) {
      if (!turnstileToken) {
        return NextResponse.json(
          {
            error: "Security verification required",
            message: "Please complete the security verification",
          },
          { status: 400 }
        );
      }

      const isValidToken = await verifyTurnstileToken(turnstileToken);
      if (!isValidToken) {
        return NextResponse.json(
          {
            error: "Security verification failed",
            message: "Security verification failed. Please try again.",
          },
          { status: 400 }
        );
      }
    }

    // Normalize email to lowercase for consistent storage
    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { 
          error: "Email already registered",
          fieldErrors: {
            email: "An account with this email already exists. Please sign in or use a different email."
          },
          message: "An account with this email already exists"
        },
        { status: 400 }
      );
    }

    // Find or create default site
    const defaultSite =
      (await prisma.site.findFirst({
        where: { name: "default-site" },
      })) ||
      (await prisma.site.create({
        data: {
          name: "default-site",
          description: "Default site",
        },
      }));

    // Hash password with higher cost factor for better security
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user with PENDING role - they must be approved by admin
    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        name: name.trim(),
        password: hashedPassword,
        role: UserRole.PENDING, // All new users start as PENDING
        departmentId: null, // No department assigned until approved
        siteId: defaultSite.id, // Assign default site
      },
    });

    console.log("User created successfully:", user);

    // Send welcome email
    const emailResult = await sendWelcomeEmail(user);
    if (!emailResult.success) {
      console.error("Failed to send welcome email:", emailResult.error);
    }

    // send admins notification of new user
    const adminEmails = await prisma.user.findMany({
      where: {
        role: UserRole.ADMIN,
        siteId: defaultSite.id, // Only notify admins of the same site
      },
      select: {
        email: true,
      },
    });

    const noticeResult = await sendAdminNewUserEmail(
      adminEmails,
      user,
      config.appName
    );
    if (!noticeResult.success) {
      console.error(`Failed sending admin notification `);
    }

    // Return user data without sensitive information
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      departmentId: user.departmentId,
      siteId: user.siteId,
    };

    return NextResponse.json({
      user: userData,
      message: "Registration successful. Your account is pending approval. Please contact an administrator to activate your account.",
    });
  } catch (error) {
    console.error("[REGISTER_ERROR]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
