import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { UserRole } from "@prisma/client";
import { z } from "zod";

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
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        departmentId: true,
      },
    });

    console.log("User created successfully:", user);

    return NextResponse.json({
      user,
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
