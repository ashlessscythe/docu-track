import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ResponsiveDataViewProps = {
  table: ReactNode;
  mobileCards: ReactNode;
  emptyState?: ReactNode;
  isEmpty?: boolean;
  className?: string;
};

export function ResponsiveDataView({
  table,
  mobileCards,
  emptyState,
  isEmpty = false,
  className,
}: ResponsiveDataViewProps) {
  if (isEmpty && emptyState) {
    return <div className={className}>{emptyState}</div>;
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="hidden md:block rounded-lg border overflow-hidden">
        {table}
      </div>
      <div className="grid grid-cols-1 gap-4 md:hidden">{mobileCards}</div>
    </div>
  );
}
