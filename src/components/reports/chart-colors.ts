export const STATUS_COLORS = {
  approved: "#4ade80",
  pending: "#fbbf24",
  rejected: "#ef4444",
  needsReview: "#60a5fa",
} as const;

export const STATUS_CHART_COLORS: Record<string, string> = {
  Approved: STATUS_COLORS.approved,
  Pending: STATUS_COLORS.pending,
  Rejected: STATUS_COLORS.rejected,
  "Needs Review": STATUS_COLORS.needsReview,
};

export const STATUS_API_COLORS: Record<string, string> = {
  APPROVED: STATUS_COLORS.approved,
  PENDING: STATUS_COLORS.pending,
  REJECTED: STATUS_COLORS.rejected,
  NEEDS_REVIEW: STATUS_COLORS.needsReview,
};

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function breakdownTooltipFormatter(
  value: number,
  name: string,
  props: { payload?: { total?: number } }
): [string, string] {
  const total = props.payload?.total ?? 0;
  const pct = total > 0 ? ((value / total) * 100).toFixed(1) : "0.0";
  return [`${value} (${pct}%)`, name];
}

export function generateMonthOptions(count = 24) {
  const options: { value: string; label: string }[] = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    options.push({
      value: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`,
      label: date.toLocaleString("default", {
        month: "long",
        year: "numeric",
      }),
    });
  }

  return options;
}
