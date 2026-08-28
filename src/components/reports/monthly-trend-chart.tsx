"use client";

import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { formatPercent } from "./chart-colors";
import {
  useChartBreakpoint,
  chartHeight,
  chartMargins,
  chartTickSize,
  legendProps,
} from "./chart-utils";

interface MonthlyTrendItem {
  month: string;
  submissions: number;
  approvalRate: number;
}

interface MonthlyTrendChartProps {
  data: MonthlyTrendItem[];
  height?: number;
}

export function MonthlyTrendChart({
  data,
  height = 350,
}: MonthlyTrendChartProps) {
  const breakpoint = useChartBreakpoint();
  const tickSize = chartTickSize(breakpoint);
  const resolvedHeight = chartHeight(breakpoint, height);
  const showAxisLabels = breakpoint !== "sm";

  if (data.length === 0) {
    return (
      <div
        className="flex items-center justify-center text-muted-foreground text-sm sm:text-base"
        style={{ height: resolvedHeight }}
      >
        No trend data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={resolvedHeight} minWidth={0}>
      <ComposedChart
        data={data}
        margin={chartMargins(breakpoint, {
          right: breakpoint === "sm" ? 12 : 30,
          left: breakpoint === "sm" ? 0 : 20,
        })}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" tick={{ fontSize: tickSize }} />
        <YAxis
          yAxisId="left"
          orientation="left"
          tick={{ fontSize: tickSize }}
          width={breakpoint === "sm" ? 36 : 48}
          label={
            showAxisLabels
              ? {
                  value: "Submissions",
                  angle: -90,
                  position: "insideLeft",
                  style: { textAnchor: "middle", fontSize: tickSize },
                }
              : undefined
          }
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          domain={[0, 100]}
          tick={{ fontSize: tickSize }}
          width={breakpoint === "sm" ? 36 : 48}
          tickFormatter={(v) => `${v}%`}
          label={
            showAxisLabels
              ? {
                  value: "Approval Rate",
                  angle: 90,
                  position: "insideRight",
                  style: { textAnchor: "middle", fontSize: tickSize },
                }
              : undefined
          }
        />
        <Tooltip
          contentStyle={{ fontSize: tickSize }}
          formatter={(value: number, name: string) => {
            if (name === "Approval Rate") return [formatPercent(value), name];
            return [value, name];
          }}
        />
        <Legend {...legendProps(breakpoint)} />
        <Bar
          yAxisId="left"
          dataKey="submissions"
          fill="#60a5fa"
          name="Submissions"
          radius={[4, 4, 0, 0]}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="approvalRate"
          stroke="#4ade80"
          strokeWidth={breakpoint === "sm" ? 1.5 : 2}
          dot={{ r: breakpoint === "sm" ? 3 : 4 }}
          name="Approval Rate"
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
