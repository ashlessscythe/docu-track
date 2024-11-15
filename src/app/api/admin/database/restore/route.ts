import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const formData = await request.formData();
    const backupFile = formData.get("backup") as File;

    if (!backupFile) {
      return new NextResponse("No backup file provided", { status: 400 });
    }

    const backupData = JSON.parse(await backupFile.text());

    // Validate backup data structure
    if (!backupData.data || !backupData.timestamp) {
      return new NextResponse("Invalid backup file format", { status: 400 });
    }

    // Start a transaction to ensure data consistency
    await prisma.$transaction(async (tx) => {
      // Clear existing data
      await tx.document.deleteMany();
      await tx.documentType.deleteMany();
      await tx.user.deleteMany();
      await tx.department.deleteMany();

      // Restore departments first
      if (backupData.data.departments?.length) {
        await tx.department.createMany({
          data: backupData.data.departments.map(
            ({ id, name, description }: any) => ({
              id,
              name,
              description,
            })
          ),
        });
      }

      // Restore document types
      if (backupData.data.documentTypes?.length) {
        await tx.documentType.createMany({
          data: backupData.data.documentTypes.map(
            ({ id, name, description }: any) => ({
              id,
              name,
              description,
            })
          ),
        });
      }

      // Restore users
      if (backupData.data.users?.length) {
        await tx.user.createMany({
          data: backupData.data.users.map(
            ({
              id,
              email,
              name,
              password,
              role,
              departmentId,
              createdAt,
              updatedAt,
            }: any) => ({
              id,
              email,
              name,
              password,
              role,
              departmentId,
              createdAt: new Date(createdAt),
              updatedAt: new Date(updatedAt),
            })
          ),
        });
      }

      // Restore documents
      if (backupData.data.documents?.length) {
        await tx.document.createMany({
          data: backupData.data.documents.map(
            ({
              id,
              name,
              typeId,
              description,
              departmentId,
              status,
              content,
              mimeType,
              submitterId,
              approverId,
              createdAt,
              updatedAt,
            }: any) => ({
              id,
              name,
              typeId,
              description,
              departmentId,
              status,
              content,
              mimeType,
              submitterId,
              approverId,
              createdAt: new Date(createdAt),
              updatedAt: new Date(updatedAt),
            })
          ),
        });
      }
    });

    return new NextResponse("Database restored successfully", { status: 200 });
  } catch (error) {
    console.error("Failed to restore database:", error);
    return new NextResponse(
      error instanceof Error ? error.message : "Failed to restore database",
      { status: 500 }
    );
  }
}
