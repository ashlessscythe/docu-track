"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { STATUS_CHART_COLORS } from "./chart-colors";
import {
  useChartBreakpoint,
  chartTickSize,
  pieRadii,
} from "./chart-utils";

interface StatusDistributionItem {
  status: string;
  count: number;
  percentage: number;
}

interface StatusDistributionChartProps {
  data: StatusDistributionItem[];
  height?: number;
}

export function StatusDistributionChart({
  data,
  height = 300,
}: StatusDistributionChartProps) {
  const breakpoint = useChartBreakpoint();
  const radii = pieRadii(breakpoint);
  const tickSize = chartTickSize(breakpoint);
  const chartAreaHeight =
    breakpoint === "sm"
      ? Math.max(height - 72, 180)
      : breakpoint === "md"
        ? Math.max(height - 64, 200)
        : Math.max(height - 56, 220);

  if (data.length === 0 || data.every((d) => d.count === 0)) {
    return (
      <div
        className="flex items-center justify-center text-muted-foreground text-sm sm:text-base"
        style={{ height }}
      >
        No document data available
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div style={{ height: chartAreaHeight }}>
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <PieChart margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
            <Pie
              data={data}
              dataKey="count"
              nameKey="status"
              cx="50%"
              cy="50%"
              innerRadius={radii.inner}
              outerRadius={radii.outer}
              paddingAngle={2}
              label={false}
              labelLine={false}
            >
              {data.map((entry) => (
                <Cell
                  key={entry.status}
                  fill={STATUS_CHART_COLORS[entry.status] ?? "#94a3b8"}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ fontSize: tickSize }}
              formatter={(value: number, name: string, props) => {
                const pct = props.payload?.percentage ?? 0;
                return [`${value} (${pct.toFixed(1)}%)`, name];
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div
        className="grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-4"
        style={{ fontSize: tickSize }}
      >
        {data.map((item) => (
          <div
            key={item.status}
            className="flex items-center gap-2 min-w-0"
          >
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{
                backgroundColor:
                  STATUS_CHART_COLORS[item.status] ?? "#94a3b8",
              }}
            />
            <span className="truncate text-muted-foreground">
              {item.status}:{" "}
              <span className="font-medium text-foreground">
                {item.percentage.toFixed(1)}%
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
