export enum UserRole {
  SUBMITTER = "SUBMITTER",
  APPROVER = "APPROVER",
  ADMIN = "ADMIN",
  PENDING = "PENDING",
}

export type Department = {
  id: string;
  name: string;
  description?: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: Department;
  departmentId?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type DocumentType = {
  id: string;
  name: string;
  description?: string;
  type?: string;
  [key: string]: any; // For additional optional fields with defaults
};

export type Document = {
  id: string;
  name: string;
  typeId: string;
  type: DocumentType;
  description: string;
  departmentId?: string;
  department?: Department;
  status: "PENDING" | "APPROVED" | "REJECTED" | "NEEDS_REVIEW";
  mimeType: string;
  createdAt: Date;
  updatedAt: Date;
  submitterId: string;
  submitter: User;
  approverId?: string;
  approver?: User;
};
