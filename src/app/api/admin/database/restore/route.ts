import { NextResponse } from "next/server";
import { requireAdmin, parseBody } from "@/lib/api-auth";
import { databaseRestoreSchema } from "@/lib/schemas";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const session = await requireAdmin();
    if (session instanceof Response) return session;

    const siteId = session.user.siteId;
    if (!siteId) {
      return new NextResponse("Admin must be assigned to a site", {
        status: 403,
      });
    }

    const body = await request.json();
    const parsed = parseBody(databaseRestoreSchema, body);
    if (parsed instanceof Response) return parsed;

    const backupData = parsed.data;

    // Start a transaction to ensure data consistency
    const { data: restoreData } = parsed.data;

    await prisma.$transaction(async (tx) => {
      await tx.document.deleteMany({ where: { siteId } });
      await tx.documentType.deleteMany({ where: { siteId } });
      await tx.user.deleteMany({ where: { siteId } });
      await tx.department.deleteMany({ where: { siteId } });

      if (restoreData.departments?.length) {
        await tx.department.createMany({
          data: restoreData.departments.map(
            (dept) => ({
              id: dept.id as string,
              name: dept.name as string,
              description: (dept.description as string) ?? null,
              siteId,
            })
          ),
        });
      }

      // Restore document types
      if (restoreData.documentTypes?.length) {
        await tx.documentType.createMany({
          data: restoreData.documentTypes.map(
            (type) => ({
              id: type.id as string,
              name: type.name as string,
              description: (type.description as string) ?? null,
              siteId,
            })
          ),
        });
      }

      // Restore users (password must be provided in backup for restore)
      if (restoreData.users?.length) {
        await tx.user.createMany({
          data: restoreData.users.map(
            (user) => ({
              id: user.id as string,
              email: user.email as string,
              name: user.name as string,
              password: user.password as string,
              role: user.role as "ADMIN" | "APPROVER" | "SUBMITTER" | "REPORTER" | "PENDING",
              departmentId: (user.departmentId as string) ?? null,
              siteId,
              createdAt: new Date(user.createdAt as string),
              updatedAt: new Date(user.updatedAt as string),
            })
          ),
        });
      }

      // Restore documents
      if (restoreData.documents?.length) {
        await tx.document.createMany({
          data: restoreData.documents.map(
            (doc) => ({
              id: doc.id as string,
              name: doc.name as string,
              typeId: doc.typeId as string,
              description: doc.description as string,
              departmentId: (doc.departmentId as string) ?? null,
              status: doc.status as "PENDING" | "APPROVED" | "REJECTED" | "NEEDS_REVIEW",
              content: doc.content as Buffer,
              mimeType: doc.mimeType as string,
              submitterId: doc.submitterId as string,
              approverId: (doc.approverId as string) ?? null,
              siteId,
              createdAt: new Date(doc.createdAt as string),
              updatedAt: new Date(doc.updatedAt as string),
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
