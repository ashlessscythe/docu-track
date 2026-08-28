import { DocumentStatus, FeedbackStatus } from "@prisma/client";

export function formatDocumentStatus(status: string): string {
  if (status === "NEEDS_REVIEW") return "Needs Review";
  return status.charAt(0) + status.slice(1).toLowerCase();
}

export const documentStatusStyles: Record<DocumentStatus, string> = {
  PENDING:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200",
  APPROVED:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200",
  REJECTED:
    "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200",
  NEEDS_REVIEW:
    "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200",
};

export const feedbackStatusStyles: Record<FeedbackStatus, string> = {
  PENDING:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200",
  REVIEWED:
    "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200",
  RESOLVED:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200",
};

export function getDocumentStatusStyle(status: string): string {
  return (
    documentStatusStyles[status as DocumentStatus] ??
    "bg-muted text-muted-foreground"
  );
}

export function getFeedbackStatusStyle(status: string): string {
  return (
    feedbackStatusStyles[status as FeedbackStatus] ??
    "bg-muted text-muted-foreground"
  );
}

export const roleBadgeStyles: Record<string, string> = {
  ADMIN: "bg-red-500 text-white",
  APPROVER: "bg-blue-500 text-white",
  SUBMITTER: "bg-green-500 text-white",
  REPORTER: "bg-purple-500 text-white",
  PENDING: "bg-yellow-500 text-white",
};

export function getRoleBadgeStyle(role: string): string {
  return roleBadgeStyles[role] ?? "bg-muted text-muted-foreground";
}
