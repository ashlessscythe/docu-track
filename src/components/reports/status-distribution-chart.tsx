"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { STATUS_CHART_COLORS } from "./chart-colors";

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
  if (data.length === 0 || data.every((d) => d.count === 0)) {
    return (
      <div
        className="flex items-center justify-center text-muted-foreground"
        style={{ height }}
      >
        No document data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          dataKey="count"
          nameKey="status"
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={2}
          label={({ status, percentage }) =>
            `${status}: ${percentage.toFixed(1)}%`
          }
        >
          {data.map((entry) => (
            <Cell
              key={entry.status}
              fill={STATUS_CHART_COLORS[entry.status] ?? "#94a3b8"}
            />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number, name: string, props) => {
            const pct = props.payload?.percentage ?? 0;
            return [`${value} (${pct.toFixed(1)}%)`, name];
          }}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
