"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { formatPercent } from "./chart-colors";
import {
  useChartBreakpoint,
  chartHeight,
  chartMargins,
  chartTickSize,
} from "./chart-utils";

interface ApprovalRateItem {
  department: string;
  rate: number;
  total: number;
}

interface ApprovalRateChartProps {
  data: ApprovalRateItem[];
  height?: number;
}

function rateColor(rate: number): string {
  if (rate >= 75) return "#4ade80";
  if (rate >= 50) return "#fbbf24";
  return "#ef4444";
}

export function ApprovalRateChart({
  data,
  height = 300,
}: ApprovalRateChartProps) {
  const breakpoint = useChartBreakpoint();
  const tickSize = chartTickSize(breakpoint);
  const resolvedHeight = chartHeight(breakpoint, height);
  const yAxisWidth =
    breakpoint === "sm" ? 68 : breakpoint === "md" ? 88 : 120;

  if (data.length === 0) {
    return (
      <div
        className="flex items-center justify-center text-muted-foreground text-sm sm:text-base"
        style={{ height: resolvedHeight }}
      >
        No department data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={resolvedHeight} minWidth={0}>
      <BarChart
        data={data}
        layout="vertical"
        margin={chartMargins(breakpoint, { left: breakpoint === "sm" ? 4 : 12 })}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          type="number"
          domain={[0, 100]}
          tick={{ fontSize: tickSize }}
          tickFormatter={(v) => `${v}%`}
        />
        <YAxis
          type="category"
          dataKey="department"
          width={yAxisWidth}
          tick={{ fontSize: tickSize }}
        />
        <Tooltip
          contentStyle={{ fontSize: tickSize }}
          formatter={(value: number, _name, props) => {
            const total = props.payload?.total ?? 0;
            return [`${formatPercent(value)} (${total} docs)`, "Approval Rate"];
          }}
        />
        <Bar dataKey="rate" name="Approval Rate" radius={[0, 4, 4, 0]}>
          {data.map((entry) => (
            <Cell key={entry.department} fill={rateColor(entry.rate)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
