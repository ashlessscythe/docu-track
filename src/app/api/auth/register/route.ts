import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { UserRole } from "@prisma/client";
import { z } from "zod";
import { sendAdminNewUserEmail, sendWelcomeEmail } from "@/lib/email";
import { config } from "@/src/lib/config";

// Validation schema
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    // Parse request body
    const body = await req.json();
    console.log("Register request body:", body);

    // Validate input
    const result = registerSchema.safeParse(body);
    if (!result.success) {
      console.error("Validation error:", result.error);
      return NextResponse.json(
        { error: "Invalid input", details: result.error.errors },
        { status: 400 }
      );
    }

    const { email, password, name } = result.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
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

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: UserRole.PENDING,
        departmentId: null,
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
      message: "Registration successful",
    });
  } catch (error) {
    console.error("[REGISTER_ERROR]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
