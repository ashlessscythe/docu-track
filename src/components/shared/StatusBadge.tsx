import { cn } from "@/lib/utils";
import {
  formatDocumentStatus,
  getDocumentStatusStyle,
  getFeedbackStatusStyle,
} from "@/lib/status-styles";

type StatusBadgeProps = {
  status: string;
  type?: "document" | "feedback";
  className?: string;
};

export function StatusBadge({
  status,
  type = "document",
  className,
}: StatusBadgeProps) {
  const style =
    type === "feedback"
      ? getFeedbackStatusStyle(status)
      : getDocumentStatusStyle(status);

  const label =
    type === "document" ? formatDocumentStatus(status) : status.replace(/_/g, " ");

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        style,
        className
      )}
    >
      {label}
    </span>
  );
}
