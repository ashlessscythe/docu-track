import { DocumentStatus, UserRole, FeedbackStatus } from "@prisma/client";
import { z } from "zod";

export const documentStatusSchema = z.nativeEnum(DocumentStatus);

export const userRoleSchema = z.nativeEnum(UserRole);

export const feedbackStatusSchema = z.nativeEnum(FeedbackStatus);

export const updateDocumentStatusSchema = z.object({
  status: documentStatusSchema,
  comment: z.string().max(5000).optional(),
});

export const feedbackCreateSchema = z.object({
  content: z.string().min(1).max(5000),
});

export const adminUserCreateSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain uppercase, lowercase, and number"
    ),
  name: z.string().min(1).max(200),
  role: userRoleSchema,
  departmentId: z.string().optional().nullable(),
  siteId: z.string().optional().nullable(),
});

export const adminUserUpdateSchema = z.object({
  role: userRoleSchema.optional(),
  departmentId: z.string().optional().nullable(),
  siteId: z.string().optional().nullable(),
  password: z
    .string()
    .min(8)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .optional(),
  name: z.string().min(1).max(200).optional(),
  email: z.string().email().optional(),
});

export const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "image/png",
  "image/jpeg",
  "text/plain",
] as const;

export const MAX_FILE_SIZE = 1.5 * 1024 * 1024;

export function sanitizeFilename(filename: string): string {
  return filename.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 255);
}

export function validateFileUpload(file: File | null): string | null {
  if (!file) return "File is required";
  if (file.size > MAX_FILE_SIZE) return "File exceeds 1.5MB limit";
  if (!ALLOWED_MIME_TYPES.includes(file.type as (typeof ALLOWED_MIME_TYPES)[number])) {
    return "File type not allowed";
  }
  return null;
}

export const databaseRestoreSchema = z.object({
  confirmToken: z.literal("RESTORE_DATABASE"),
  data: z.object({
    users: z.array(z.record(z.unknown())).optional(),
    documents: z.array(z.record(z.unknown())).optional(),
    departments: z.array(z.record(z.unknown())).optional(),
    documentTypes: z.array(z.record(z.unknown())).optional(),
    sites: z.array(z.record(z.unknown())).optional(),
    templates: z.array(z.record(z.unknown())).optional(),
    feedback: z.array(z.record(z.unknown())).optional(),
  }),
});
