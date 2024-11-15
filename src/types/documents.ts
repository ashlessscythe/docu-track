import {
  Document,
  DocumentStatus,
  DocumentType,
  User,
  Department,
} from "@prisma/client";

// Omit the date fields from the original Document type
type DocumentWithoutDates = Omit<Document, "createdAt" | "updatedAt">;

// Create a new type with string dates as they come from the API
export type DocumentWithRelations = DocumentWithoutDates & {
  submitter: Pick<User, "name" | "email">;
  type: DocumentType;
  department: Department | null;
  createdAt: string;
  updatedAt: string;
};

export type { DocumentStatus, Department, DocumentType };
